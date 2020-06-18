const RECARGAS_API_KEY = 'c72c9adf1a4f7433b4153c5ed20758f5';
const PRODUCT_CODE = '01000050';
const AMOUNT = 50;
const RECARGAS_URL = 'http://recargasnacionales.com/wstest?wsdl';

const express = require('express'),
    router = express.Router(),
    soap = require('soap'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    transaction = require('../model/transaction');

router.route('/')
    .post((req, res) => {
        const twiml = new MessagingResponse();
        const enteredPhoneNumber = req.body.Body;
        const nakedPhoneNumber = enteredPhoneNumber.replace(/[^0-9]/g, '');

        res.writeHead(200, {'Content-Type': 'text/xml'});

        if (nakedPhoneNumber.length === 10) {
            // check if it is in DATABASE
            if (nakedPhoneNumber === "4804340203") {
                twiml.message(enteredPhoneNumber + ' no está dado de alta para recargas automáticas.');
                res.end(twiml.toString());
            } else {

                const args = {
                    APIKey: RECARGAS_API_KEY,
                    ProductCode: PRODUCT_CODE,
                    Amount: AMOUNT,
                    PhoneNumber: nakedPhoneNumber
                };

                soap.createClient(RECARGAS_URL, function(err, client) {
                    client.TAERequest(args, function(err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            twiml.message('Se ha abonado $' + result.return.Amount['$value'] + '.00 MXN de saldo a la linea ' + result.return.PhoneNumber['$value'] + ' con el folio ' + result.return.TransactionNumber['$value']);
                            res.end(twiml.toString());
                        }
                    })
                });
            }
        } else {
            twiml.message(enteredPhoneNumber + ' no es un número de teléfono válido',);
            res.end(twiml.toString());
        }
    });

module.exports = router;
