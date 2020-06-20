const PRODUCT_CODE = '01000050';
const AMOUNT = 50;
const CUSTOMER_SERVICE_NUMBER = '999 573 1249';

const soap = require('soap'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    models = require('../utils/model-list'),
    ObjectId = require('mongoose').Types.ObjectId,
    Transaction = require('../model/transaction'),
    simController = require('../controller/sim');

exports.addBalance = (req, res) => {
    const twiml = new MessagingResponse();
    //const enteredPhoneNumber = req.body.Body;
    const enteredPhoneNumber = "9911083007";
    const nakedPhoneNumber = enteredPhoneNumber.replace(/[^0-9]/g, '');

    res.writeHead(200, {'Content-Type': 'text/xml'});

    if (nakedPhoneNumber.length === 10) {
        simController.existsSim(nakedPhoneNumber)
            .then(sim => {
                if (sim.active === true) {
                    console.log("El número ya ha sido activado");
                    twiml.message('El número ' + enteredPhoneNumber + ' ya ha sido activado. verifíque que el número sea correcto e inténtelo de nuevo. Para más información comuníquese al teléfono: ' + CUSTOMER_SERVICE_NUMBER);
                    res.end(twiml.toString());
                } else {
                    console.log("Procesando recarga");

                    const args = {
                        APIKey: process.env.RECARGAS_API_KEY,
                        ProductCode: PRODUCT_CODE,
                        Amount: AMOUNT,
                        PhoneNumber: nakedPhoneNumber
                    };

                    const transaction = new Transaction();

                    soap.createClient(process.env.RECARGAS_API_URL, { wsdl_options: { timeout: 70000 }  },function(err, client) {
                        client.TAERequest(args, function(err, result) {
                            if (err) {
                                transaction.success = false;
                                transaction.return_code = 'Error';
                                transaction.transaction_id = 'Error';
                                transaction.transaction_number = 'Error';
                                twiml.message('Por el momento el sistema no está disponible. Para más información comuníquese al teléfono: ' + CUSTOMER_SERVICE_NUMBER);
                                res.end(twiml.toString());
                                console.log(err);
                            } else {
                                transaction.return_code = result.return.ReturnCode['$value'];
                                transaction.transaction_id = result.return.IDTransaction['$value'];
                                transaction.transaction_number = result.return.TransactionNumber['$value'];
                                if (result.return.ReturnCode['$value'] === '0') {
                                    console.log("Recarga exitosa");
                                    transaction.success = true;
                                    twiml.message('Se ha abonado $' + result.return.Amount['$value'] + '.00 MXN de saldo a la linea ' + result.return.PhoneNumber['$value'] + ' con el folio ' + result.return.TransactionNumber['$value']);





                                    // Agrégalo aquí.







                                } else {
                                    console.log("Error al realizar recarga");
                                    transaction.success = false;
                                    twiml.message('Por el momento el sistema no está disponible. Para más información comuníquese al teléfono: ' + CUSTOMER_SERVICE_NUMBER);
                                }
                                res.end(twiml.toString());
                            }

                            transaction.date = Date.now();
                            transaction.amount = AMOUNT;
                            transaction.phone_number = nakedPhoneNumber;
                            transaction.distributor_id = sim.distributor_id;

                            transaction.save((err) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log("Success saving transaction")
                                }
                            });
                        })
                    });
                }
            })
            .catch(error => {
                if (error === 404) {
                    twiml.message(enteredPhoneNumber + ' no está dado de alta para recargas automáticas.');
                } else {
                    twiml.message('Por el momento el sistema no está disponible. Para más información comuníquese al teléfono: ' + CUSTOMER_SERVICE_NUMBER);
                }
                console.log(error);
                res.end(twiml.toString());
            })
    } else {
        console.log("Número de teléfono no valido");
        twiml.message(enteredPhoneNumber + ' no es un número de teléfono válido');
        res.end(twiml.toString());
    }
};