const PRODUCT_CODE = '01000050';
const AMOUNT = 50;
const CUSTOMER_SERVICE_NUMBER = '999 573 1249';

const soap = require('soap'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    transaction = require('../model/transaction'),
    models = require('../utils/model-list'),
    ObjectId = require('mongoose').Types.ObjectId,
    Transaction = require('../model/transaction');
    simController = require('../controller/sim');

exports.addBalance = (req, res) => {
    const twiml = new MessagingResponse();
    //const enteredPhoneNumber = req.body.Body;
    const enteredPhoneNumber = "4804340203";
    const nakedPhoneNumber = enteredPhoneNumber.replace(/[^0-9]/g, '');

    res.writeHead(200, {'Content-Type': 'text/xml'});

    if (nakedPhoneNumber.length === 10) {
        simController(nakedPhoneNumber)
            .then(sim => {
                if (nakedPhoneNumber === "4804340203") {
                    twiml.message(enteredPhoneNumber + ' no está dado de alta para recargas automáticas.');
                    res.end(twiml.toString());
                } else {
        
                    const args = {
                        APIKey: process.env.RECARGAS_API_KEY,
                        ProductCode: PRODUCT_CODE,
                        Amount: AMOUNT,
                        PhoneNumber: nakedPhoneNumber
                    };
        
        
        
        
        
        
        
                    /**
                     ***** A ver si sí es así 
                     */
                    let transaction = new Transaction();
        
                    transaction.date = '',
                    transaction.phone_number = '',
                    transaction.distributor_id = '',
                    transaction.transaction_number = '',
                    transaction.transaction_id = '',
                    transaction.amount = '',
                    transaction.return_code = '',
                    transaction.succes = ''
        
                    // save the user and check for errors
                    transaction.save((err) => {
                        if (err) {
                            res.json(err);
                        } else {
                            
                            // Saved succesfully 
                            
                        }
                    });
        
        
        
        
        
        
        
        
        
        
        
        
                    res.end("Transaction exitosa");
        
                    // soap.createClient(process.env.RECARGAS_API_URL, { wsdl_options: { timeout: 70000 }  },function(err, client) {
                    //     client.TAERequest(args, function(err, result) {
                    //         if (err) {
                    //             twiml.message('Por el momento el sistema no está disponible. Para más información comuníquese al teléfono: ' + CUSTOMER_SERVICE_NUMBER);
                    //             res.end(twiml.toString());
                    //             console.log(err);
                    //         } else {
                    //             if (result.return.ReturnCode['$value'] === '0') {
                    //                 twiml.message('Se ha abonado $' + result.return.Amount['$value'] + '.00 MXN de saldo a la linea ' + result.return.PhoneNumber['$value'] + ' con el folio ' + result.return.TransactionNumber['$value']);
                    //             } else {
                    //                 twiml.message('Por el momento el sistema no está disponible. Para más información comuníquese al teléfono: ' + CUSTOMER_SERVICE_NUMBER);
                    //             }
                    //             res.end(twiml.toString());
                    //         }
                    //     })
                    // });
                }
            })
            .catch(error => {
                if (error === 404)
                    res.sendStatus(error)
            })
    } else {
        twiml.message(enteredPhoneNumber + ' no es un número de teléfono válido',);
        res.end(twiml.toString());
    }
};