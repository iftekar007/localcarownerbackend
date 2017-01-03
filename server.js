/**
 * Created by debasis on 14/9/16.
 */

var express = require('express');
var app = express();
var port = process.env.PORT || 8004;


var http = require('http').Server(app);
//var request = require('request');


var mailer = require("nodemailer");


var bodyParser = require('body-parser');
app.use(bodyParser.json({ parameterLimit: 10000000,
    limit: '90mb'}));
app.use(bodyParser.urlencoded({ parameterLimit: 10000000,
    limit: '90mb', extended: false}));
var multer  = require('multer');
var datetimestamp='';
var filename='';
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploadedfiles/sharelinks/');
    },
    filename: function (req, file, cb) {

        console.log(file.originalname);
        filename=file.originalname.split('.')[0].replace(/ /g,'') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        console.log(filename);
        cb(null, filename);
    }
});


var EventEmitter = require('events').EventEmitter;

const emitter = new EventEmitter()
//emitter.setMaxListeners(100)
// or 0 to turn off the limit
emitter.setMaxListeners(0)

var upload = multer({ //multer settings
    storage: storage
}).single('file');


app.use(bodyParser.json({type: 'application/vnd.api+json'}));




app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});




/** API path that will upload the files */
app.post('/uploads', function(req, res) {
    datetimestamp = Date.now();
    upload(req,res,function(err){

        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        var item =new Object();

        item.error_code=0;
        item.filename=filename;

        res.send(filename);
    });
});

var mongodb = require('mongodb');
var db;
//var faqdb;
//var url = 'mongodb://localhost:27017/probidbackend';
var url = 'mongodb://localhost:27017/localcarownerbackend';

var MongoClient = mongodb.MongoClient;

MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log(err);

    }else{
        db=database;
        //faqdb=database.faqs;

    }});




app.get('/addexpertarea', function (req, resp) {

    value1 = {title: 'sdf',description: '5435', priority: 6,status: 0};

    var collection = db.collection('addexpertarea');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});


app.post('/addlead', function (req, resp) {

    var added_on=Date.now();
    value1 = { 'fname': req.body.fname, 'lname': req.body.lname, 'dealer': req.body.dealer, 'email': req.body.email, 'phone': req.body.phone ,'addedon':added_on};
    console.log(req.body);

    var collection = db.collection('leads');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {

            var smtpTransport = mailer.createTransport("SMTP", {
                service: "Gmail",
                auth: {
                    user: "itplcc40@gmail.com",
                    pass: "DevelP7@"
                }
            });

            var mail = {
                from: "Localcarowner Support <samsujdev@gmail.com>",
                to: req.body.email,
                subject: 'THANK YOU FOR TAKING INTEREST IN LOCAL CAR OWNER',
                //text: "Node.js New world for me",
                html: '<table width="100%" border="0">\
                <tr>\
                <td align="center" valign="middle">\
                <table width="600" border="0" cellpadding="0" cellspacing="0" style="background:#101526; padding:0;">\
                <tr>\
                <td><img src="http://influxiq.com/projects/localcarowner/src/assets/mailimg1.jpg"  alt="#" style="width:100%;"/></td>\
                </tr>\
                <tr>\
                <td style="padding:10px;">\
                <div style=" display:block; background:#fff; padding:15px; font-family:Arial, Helvetica, sans-serif; font-size:16px; color:#101527; line-height:24px;">\
                <h1 style="margin:0 0 10px 0; padding:0px; font-size:18px; color:#d91221; font-weight:normal; "> Hello <span style="color:#11bbd4;">'+req.body.fname+' '+req.body.lname+',</span></h1>\
            Thank you for your interest in the LocalCarOwner.com services. We may call to ask a few more questions to get everything needed to send you an accurate count. Please see the attached PDFs to learn more about our programs.\
            <br /><br />\
            Looking forward to speaking with you soon.<br /><br />\
            You can call me direct at any time.<br /><br />\
            Rino Finelli – Managing Partner<br /><br />\
            <span style="color:#d91221; display:block; padding-bottom:10px;"><a href="LocalCarOwner.com" target="_blank"  style="color:#d91221; text-decoration:none;">LocalCarOwner.com</a></span>\
              <span style="color:#d91221; display:block; \padding-bottom:10px;">Office: <a href="tel:561-338-8292"  style="color:#d91221;">561-338-8292</a></span>\
            <span style="color:#d91221; display:block; padding-bottom:10px;">Mobile: <a href="tel:954-600-7466"  style="color:#d91221;">954-600-7466</a></span>\
            <span style="color:#d91221; display:block; padding-bottom:10px;"><a href="mailto:sales@LocalCarOwner.com" style="color:#d91221;">sales@LocalCarOwner.com</a></span>\
            </div>\
            </td>\
            </tr>\
            <tr>\
            <td style="background:#d91221; padding:15px 10px; font-family:Arial, Helvetica, sans-serif; font-size:16px; color:#fff;">\
                <table width="100%" border="0" >\
                <tr>\
                <td align="left" valign="middle" width="50">Contact  <a href="tel:208.754.7402" style="color:#fff;">208.754.7402</a></td>\
            <td align="right" valign="middle" width="50" style="text-align:right;"><a href="LocalCarOwner.com" target="_blank"  style="color:#fff;  text-decoration:none;">LocalCarOwner.com</a></td>\
                </tr>\
                </table>\
                </td>\
                </tr>\
                </table>\
                </td>\
                </tr>\
                </table>'
            }

            smtpTransport.sendMail(mail, function (error, response) {
                //resp.send((response.message));
                //smtpTransport.close();
            });


            var mail = {
                from: "Localcarowner Support <samsujdev@gmail.com>",
                to: 'rino@worldtoworldmedia.com,lannah@lampconsulting.com,beto@betoparedes.com',
                //to: 'subhra.influxiq@gmail.com',
                bcc: 'debasiskar007@gmail.com',
                subject: 'Subject: '+req.body.fname+' '+req.body.lname+' has just submitted the Local car owner information form',
                //text: "Node.js New world for me",
                html: 'New Form submission : <br/>\
                    Name: '+req.body.fname+' '+req.body.lname+' <br/>\
                Dealership :'+req.body.dealer+' <br/>\
                Email :'+req.body.email+' <br/>\
                Phone Number : '+req.body.phone+''
            }

            smtpTransport.sendMail(mail, function (error, response) {
                //resp.send((response.message));
                smtpTransport.close();
            });
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});



app.post('/addbannersize', function (req, resp) {

    value1 = {sizename:req.body.sizename,height:req.body.height,width:req.body.width};

    var collection = db.collection('bannersize');

    collection.insert([value1], function (err, result) {
        if (err) {
            resp.send(err);
        } else {


            var smtpTransport = mailer.createTransport("SMTP", {
                service: "Gmail",
                auth: {
                    user: "itplcc40@gmail.com",
                    pass: "DevelP7@"
                }
            });

            var mail = {
                from: "Admin <samsujdev@gmail.com>",
                to: 'debasiskar007@gmail.com',
                subject: 'Test',
                //text: "Node.js New world for me",
                html: 'Hi Test'
            }

            smtpTransport.sendMail(mail, function (error, response) {
                //resp.send((response.message));
                smtpTransport.close();
            });
            resp.send('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);

        }
    });

});



function mailsend(type,email,added_on,items,values,invoice){
    if(type=='customersignup'){
        var subject="THANK YOU FOR SIGNING UP WITH PROBIDAUTO.COM";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
                <html xmlns="http://www.w3.org/1999/xhtml">\
                <head>\
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
                <title>Customer Signup</title>\
            </head>\
                <body>\
                <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
                <div style="width:620px;">\
                <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
                <table width="100%" border="0">\
               <tr>\
                <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" style="margin:10px;"/></td>\
                <td align="right" valign="middle"><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong style="color:#fb4a32;">Date:</strong> '+timeConverter(added_on)+'</span></td>\
           </tr>\
            </table>\
                <img src="http://probiddealer.influxiq.com/images/customersignupstep1.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:26px; line-height:30px; text-align:center; padding:0px; margin:30px 10px 15px 10px; color:#333; font-weight:normal; text-transform:uppercase;">Thank you for signing up<br/><span style="color:#fb4a32;"> with ProBidAuto.com</span></h2>\
                <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 0px 0px 10px 0px;">We are very excited to give you access to the biggest inventory of autos in your area.<br />\
            <span style="text-transform:uppercase;">The local auctions!</span><br />You are going to love the experience your dealer has brought to you <br />through with <span style="color:#fb4a32;">ProBidAuto.com</span>\
                </h3>\
                <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal;    padding: 0px; margin: 0px 10px 10px 10px;">If you have not downloaded the <span style="text-transform:uppercase; color:#fb4a32;">ProBidAuto.com</span> phone app yet be sure to do that right away! That way your dealer can RSVP you cars that match your criteria right away.</h3>\
            <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px;     padding: 0px;margin: 0px 10px 10px 10px; color:#333; font-weight:normal;">The ProBidAuto.com Staff</h3> </div>\
                <div style="width:100%; padding:10px;">\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
               <div style="display:block; width:100%; text-align:center;">\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
         </div>\
               <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
                </div>\
                </div>\
                </div>\
        </body>\
            </html>';
    }
    if(type=='freecustomercreditcard'){
        var subject="THANK YOU FOR COMPLETING SIGNING UP WITH PROBIDAUTO.COM";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
                <html xmlns="http://www.w3.org/1999/xhtml">\
                <head>\
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
                <title>Customer Signup</title>\
            </head>\
                <body>\
                <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
                <div style="width:620px;">\
                <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
                <table width="100%" border="0">\
               <tr>\
                <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" style="margin:10px;"/></td>\
                <td align="right" valign="middle"><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong style="color:#fb4a32;">Date:</strong> '+timeConverter(added_on)+'</span></td>\
           </tr>\
            </table>\
                <img src="http://probiddealer.influxiq.com/images/customersignupstep1.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:26px; line-height:30px; text-align:center; padding:0px; margin:30px 10px 15px 10px; color:#333; font-weight:normal; text-transform:uppercase;">Thank you for completing your registration<br/><span style="color:#fb4a32;"> with ProBidAuto.com</span></h2>\
                <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 0px 0px 10px 0px;">We are very excited to give you complete access to the biggest inventory of autos in your area.<br />\
            <span style="text-transform:uppercase;">The local auctions!</span><br />You can now have full access to the inventory details of the cars of your choice\
                </h3>\
                <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 0px 0px 10px 0px;">Please fill out the RETAIL CUSTOMER CONNECT Form to let us better understand your needs and provide the best inventory matches.\
            <h3>\
<h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal;    padding: 0px; margin: 0px 10px 10px 10px;">If you have not downloaded the <span style="text-transform:uppercase; color:#fb4a32;">ProBidAuto.com</span> phone app yet be sure to do that right away! That way your dealer can RSVP you cars that match your criteria right away.</h3>\
            <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px;     padding: 0px;margin: 0px 10px 10px 10px; color:#333; font-weight:normal;">The ProBidAuto.com Staff</h3> </div>\
                <div style="width:100%; padding:10px;">\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
               <div style="display:block; width:100%; text-align:center;">\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
         </div>\
               <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
                </div>\
                </div>\
                </div>\
        </body>\
            </html>';

    }
    if(type=='customerfreesignup'){
        var link=values+'.probidauto.com/#/freecustomercreditcard/'+invoice;
        var subject="DEALER FREE COUPON EMAIL";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
                <html xmlns="http://www.w3.org/1999/xhtml">\
                <head>\
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
                <title>Customer Signup</title>\
            </head>\
                <body>\
                <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
                <div style="width:620px;">\
                <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
                <table width="100%" border="0">\
               <tr>\
                <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" style="margin:10px;"/></td>\
                <td align="right" valign="middle"><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong style="color:#fb4a32;">Date:</strong> '+timeConverter(added_on)+'</span></td>\
           </tr>\
            </table>\
                <img src="http://probiddealer.influxiq.com/images/customersignupstep1.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:26px; line-height:30px; text-align:center; padding:0px; margin:30px 10px 15px 10px; color:#333; font-weight:normal; text-transform:uppercase;"><span style="color:#fb4a32;">Hello, '+items+' </span> Enjoy this free gift from your Dealer.\
            </h2>\
                <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 0px 0px 10px 0px;">We have noticed that you have left without completing the second step of the signup process.\
            <br />\
Your dealer '+values+', has decided to send you a free gift voucher to complete your signup.\
           </h3>\
                <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal;    padding: 0px; margin: 0px 10px 10px 10px;">You can use this code to signup for free. \
                <br/>\
                Your free signup code is : '+invoice+'\
                </h3>\
                 <br/>\
            <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px;     padding: 0px;margin: 0px 10px 10px 10px; color:#333; font-weight:normal;"><a  href='+link+'>Click Here</a> to go back and complete your signup for FREE.</h3> </div>\
                <div style="width:100%; padding:10px;">\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
               <div style="display:block; width:100%; text-align:center;">\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
         </div>\
               <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
                </div>\
                </div>\
                </div>\
        </body>\
            </html>';
    }
    if(type=='dealersignup'){
        var subject="THANK YOU FOR JOINING PROBIDAUTO";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
                <html xmlns="http://www.w3.org/1999/xhtml">\
                <head>\
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
                <title>Customer Signup</title>\
            </head>\
                <body>\
                <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
                <div style="width:620px;">\
                <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
                <table width="100%" border="0">\
               <tr>\
                <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" style="margin:10px;"/></td>\
                <td align="right" valign="middle"><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong style="color:#fb4a32;">Date:</strong> '+timeConverter(added_on)+'</span></td>\
           </tr>\
            </table>\
                <img src="http://probiddealer.influxiq.com/images/customersignupstep1.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:26px; line-height:30px; text-align:center; padding:0px; margin:30px 10px 15px 10px; color:#333; font-weight:normal; text-transform:uppercase;">Thank you for signing up<br/><span style="color:#fb4a32;"> with ProBidAuto.com</span></h2>\
                <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 0px 0px 10px 0px;">We are very excited to give you access to the biggest inventory of autos in your area.<br />\
            <span style="text-transform:uppercase;">The local auctions!</span><br /> You are going to love the experience this incredible system that has brought to you <br />through with <span style="color:#fb4a32;">ProBidAuto.com</span>\
                </h3>\
                <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal;    padding: 0px; margin: 0px 10px 10px 10px;">We also have the <span style="text-transform:uppercase; color:#fb4a32;">ProBidAuto.com</span> phone app for your customers.Make sure to let your customers know about it so that they can check the RSVP of cars you send to them directly from their phone.</h3>\
            <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px;     padding: 0px;margin: 0px 10px 10px 10px; color:#333; font-weight:normal;">The ProBidAuto.com Staff</h3> </div>\
                <div style="width:100%; padding:10px;">\
                <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
               <div style="display:block; width:100%; text-align:center;">\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
                <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
         </div>\
               <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
                </div>\
                </div>\
                </div>\
        </body>\
            </html>';
    }
    if(type=='retailcustomerconnect') {
        var subject = "YOU ARE SET";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
            <html xmlns="http://www.w3.org/1999/xhtml">\
            <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
            <title>Retail customer connect</title>\
        </head>\
            <body>\
            <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
            <div style="width:620px;">\
            <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
            <table width="100%" border="0">\
            <tr>\
            <td align="left" valign="top"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" style="margin:10px;"/></td>\
            <td align="right" valign="middle"><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong style="color:#fb4a32;">Date:</strong> '+timeConverter(added_on)+'</span></td>\
        </tr>\
        </table>\
            <img src="http://probiddealer.influxiq.com/images/retailcustomercunnectstep3.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 15px 0px 10px 0px;">Now that we know exactly what your preferences are we can match your desired auto purchase to <span style="text-transform:uppercase;">upcoming auction inventory.</span><br /> Be sure to pay close attention to emails or push notifications from your dealer to RSVP for autos that <span style="text-transform:uppercase;">YOU WANT.</span>\
        </h3>\
        <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal;    padding: 0px; margin: 0px 10px 10px 10px;">If you have not downloaded the <span style="text-transform:uppercase; color:#fb4a32;">ProBidAuto.com</span> phone app yet be sure to do that right away! That way your dealer can RSVP you cars that match your criteria right away.</h3>\
        <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px;     padding: 0px;margin: 0px 10px 10px 10px; color:#333; font-weight:normal;">The ProBidAuto.com Staff</h3>\</div>\
            <div style="width:100%; padding:10px;">\
            <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
            <div style="display:block; width:100%; text-align:center;">\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
            </div>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
            </div>\
            </div>\
            </div>\
            </body>\
        </html>';
    }
    if(type=='finance') {
        var subject = "THANK YOU FOR APPLYING FOR FINANCING";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
            <html xmlns="http://www.w3.org/1999/xhtml">\
            <head>\
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
            <title>Customer Signup</title>\
        </head>\
            <body>\
            <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
            <div style="width:620px;">\
            <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
            <table width="100%" border="0">\
            <tr>\
            <td align="left" valign="top"><img src="http://www.probidtech.influxiq.com/images/customermaillogo.png"  alt="#" style="margin:10px;"/></td>\
            <td align="right" valign="middle"><span style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000;"><strong style="color:#fb4a32;">Date:</strong> '+timeConverter(added_on)+'</span></td>\
        </tr>\
        </table>\
            <img src="http://www.probidtech.influxiq.com/images/financestep4.jpg"  alt="#" style="width:100%; border:solid 1px #ccc;"/>\
            <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:26px; line-height:30px; text-align:center; padding:0px; margin:30px 10px 15px 10px; color:#333; font-weight:normal; text-transform:uppercase;">Thank you for applying<br/> for<span style="color:#fb4a32;"> financing</span></h2>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal; padding: 0px; margin: 0px 0px 10px 0px;">We have all the information we need to find out what level of vehicle financing <br /><span style="text-transform: uppercase;">you will qualify for</span>.<br />Please give your dealer <span style="color:#fb4a32;">24 to 48 hours</span> to get back to you on the options available to you for<span style="color:#fb4a32;"> financing.</span>\
            </h3>\
            <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px; color:#333; font-weight:normal;    padding: 0px; margin: 0px 10px 10px 10px;">To get more information please contact your prefered dealer directly. <br/><span>Log in</span> for further details.</h3>\
        <h3 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:30px;     padding: 0px;margin: 0px 10px 10px 10px; color:#333; font-weight:normal;">The ProBidAuto.com Staff</h3>\
        </div>\
            <div style="width:100%; padding:10px;">\
            <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
            <div style="display:block; width:100%; text-align:center;"> <a href="javascript:void(0)"><img src="http://www.probidtech.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
           <a href="javascript:void(0)"><img src="http://www.probidtech.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://www.probidtech.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://www.probidtech.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
            </div>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
    </div>\
            </div>\
            </div>\
            </body>\
        </html>';
    }
    if(type=='customercreditcard') {
        var subject = "PAYMENT SUCCESSFULLY";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
            <html xmlns="http://www.w3.org/1999/xhtml">\
            <head>\
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
            <title>Retail customer connect</title>\
        </head>\
            <body>\
            <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
            <div style="width:620px;">\
            <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#fff; padding:20px; border-bottom:solid 2px #fb4a32;">\
            <tr>\
            <td align="left" valign="middle"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" width="250"/></td>\
            <td align="right" valign="middle" style="font-size:14px; color:#000; line-height:30px;"> <span>455 Lorem Ipsum, AZ 85004, US <img src="http://probiddealer.influxiq.com/images/mail_location.png"  style="margin-left:5px;"/></span><br />\
            <span><a href="mailto:loremIpsum@mail.com" style="color:#000; text-decoration:none;">loremIpsum@mail.com </a><img src="http://probiddealer.influxiq.com/images/mail_mailinfo.png" style="margin-left:5px;"/></span><br />\
            <span><a href="tel:(000) 000-0000" style="color:#000; text-decoration:none;">(000) 000-0000 </a><img src="http://probiddealer.influxiq.com/images/mail_phone.png" style="margin-left:5px;"/></span> </td>\
            </tr>\
            </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody><tr>\
            <td align="center">\
            <div style="margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fff">\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:40px 0;font-family:Arial,Helvetica,sans-serif">\
            <tbody>\
            <tr>\
            <td align="left" valign="top">\
            <div style="border-left:solid 6px #fb4a32;padding:6px 6px 6px 10px">\
            <h2 style="color:#555;font-size:18px;font-weight:normal;margin:0;padding:0px;display:inline-block">Invoice to:</h2>\
        <br>\
        <h3 style="font-weight:normal;margin:5px 0 8px 0;padding:0px;font-size:22px;color:#fb4a32;display:inline-block">'+items[0].fname+' '+items[0].lname+'</h3>\
        <br>\
        <h4 style="font-weight:normal;margin:0;padding:0;font-size:14px;line-height:20px;color:#555555;display:inline-block; text-decoration:none;">'+items[0].address+' , '+items[0].city+' , '+items[0].state+' , '+items[0].zip+'<br /><a href="mailto:info@loremipsum.com" target="_blank" style="color:#555555; display:inline-block; text-decoration:none;">'+items[0].email+'</a></h4>\
        </div>\
        </td>\
        <td align="right" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody>\
            <tr>\
            <td align="right" valign="middle" style="padding:0 8px 0 0;color:#fb4a32;font-size:28px;text-transform:uppercase">Invoice No: '+invoice+'</td>\
        </tr>\
        <tr>\
        <td align="right" valign="middle" style="padding:2px 8px 0 0;color:#0f0f0f;font-size:14px">Invoice date:'+timeConverter(items[0].added_on)+'</td>\
        </tr>\
        <tr>\
        <td align="right" valign="middle" style="padding:15px 8px 0 0;color:#111;font-size:20px">Total amount:$19.95 </td>\
        </tr>\
        </tbody>\
        </table>\
        </td>\
        </tr>\
        </tbody>\
        </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:Arial,Helvetica,sans-serif">\
            <tbody><tr>\
            <th width="2%" align="left" valign="middle" style="background:#8c8c8c">&nbsp;</th>\
        <th width="47%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Item Description</th>\
        <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="9%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"> Price</th>\
            <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="8%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Qty. </th>\
            <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="16%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Total </th>\
            <th width="2%" align="left" valign="middle" style="background:#8c8c8c">&nbsp;</th>\
        </tr>\
            <tr>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="left" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">Customer Registration</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$19.95</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">1</td>\
            <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$19.95</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        </tr>\
        </tbody>\
        </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0px;margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;color:#333">\
            <tbody><tr>\
            <td width="100%"><table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody><tr>\
            <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Subtotal</td>\
            <td align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$19.95</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        </tr>\
            <tr>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Tax</td>\
            <td align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$0.00</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        </tr>\
        <tr>\
        <td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c;font-size:22px!important">Grand Total</td>\
        <td align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c">$19.95</td>\
        <td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td>\
        </tr>\
        </tbody></table>\
        </td>\
        </tr>\
        </tbody>\
        </table>\
        <div style="width:auto;padding:30px;text-align:center;background:#141414;color:#e9e9e9;text-align:center;margin-top:20px">Thank you For Your Purchase Order</div>\
        </div>\
        </td>\
        </tr>\
        </tbody></table>\
            </div>\
            <div style="width:100%; padding:10px;">\
            <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
            <div style="display:block; width:100%; text-align:center;">\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
            </div>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
            </div>\
            </div>\
            </div>\
            </body>\
        </html>';

    }
    if(type=='dealercreditcard') {
        var subject = "PAYMENT SUCCESSFULLY";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
            <html xmlns="http://www.w3.org/1999/xhtml">\
            <head>\
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
            <title>Dealer Signup</title>\
        </head>\
            <body>\
            <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
            <div style="width:620px;">\
            <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#fff; padding:20px; border-bottom:solid 2px #fb4a32;">\
            <tr>\
            <td align="left" valign="middle"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" width="250"/></td>\
            <td align="right" valign="middle" style="font-size:14px; color:#000; line-height:30px;"> <span>455 Lorem Ipsum, AZ 85004, US <img src="http://probiddealer.influxiq.com/images/mail_location.png"  style="margin-left:5px;"/></span><br />\
            <span><a href="mailto:loremIpsum@mail.com" style="color:#000; text-decoration:none;">loremIpsum@mail.com </a><img src="http://probiddealer.influxiq.com/images/mail_mailinfo.png" style="margin-left:5px;"/></span><br />\
            <span><a href="tel:(000) 000-0000" style="color:#000; text-decoration:none;">(000) 000-0000 </a><img src="http://probiddealer.influxiq.com/images/mail_phone.png" style="margin-left:5px;"/></span> </td>\
            </tr>\
            </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody><tr>\
            <td align="center">\
            <div style="margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fff">\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:40px 0;font-family:Arial,Helvetica,sans-serif">\
            <tbody>\
            <tr>\
            <td align="left" valign="top">\
            <div style="border-left:solid 6px #fb4a32;padding:6px 6px 6px 10px">\
            <h2 style="color:#555;font-size:18px;font-weight:normal;margin:0;padding:0px;display:inline-block">Invoice to:</h2>\
        <br>\
        <h3 style="font-weight:normal;margin:5px 0 8px 0;padding:0px;font-size:22px;color:#fb4a32;display:inline-block">'+items[0].fname+' '+items[0].lname+'</h3>\
        <br>\
        <h4 style="font-weight:normal;margin:0;padding:0;font-size:14px;line-height:20px;color:#555555;display:inline-block; text-decoration:none;">'+items[0].address+' , '+items[0].city+' , '+items[0].state+' , '+items[0].zip+'<br /><a href="mailto:info@loremipsum.com" target="_blank" style="color:#555555; display:inline-block; text-decoration:none;">'+items[0].email+'</a></h4>\
        </div>\
        </td>\
        <td align="right" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody>\
            <tr>\
            <td align="right" valign="middle" style="padding:0 8px 0 0;color:#fb4a32;font-size:28px;text-transform:uppercase">Invoice No: '+invoice+'</td>\
        </tr>\
        <tr>\
        <td align="right" valign="middle" style="padding:2px 8px 0 0;color:#0f0f0f;font-size:14px">Invoice date:'+timeConverter(items[0].added_on)+'</td>\
        </tr>\
        <tr>\
        <td align="right" valign="middle" style="padding:15px 8px 0 0;color:#111;font-size:20px">Total amount:$19.95 </td>\
        </tr>\
        </tbody>\
        </table>\
        </td>\
        </tr>\
        </tbody>\
        </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:Arial,Helvetica,sans-serif">\
            <tbody><tr>\
            <th width="2%" align="left" valign="middle" style="background:#8c8c8c">&nbsp;</th>\
        <th width="47%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Item Description</th>\
        <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="9%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"> Price</th>\
            <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="8%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Qty. </th>\
            <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="16%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Total </th>\
            <th width="2%" align="left" valign="middle" style="background:#8c8c8c">&nbsp;</th>\
        </tr>\
            <tr>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="left" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">ProBid Membership</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$19.95</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">1</td>\
            <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$19.95</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        </tr>\
        </tbody>\
        </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0px;margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;color:#333">\
            <tbody><tr>\
            <td width="100%"><table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody><tr>\
            <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Subtotal</td>\
            <td align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$19.95</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        </tr>\
            <tr>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Tax</td>\
            <td align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$0.00</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        </tr>\
        <tr>\
        <td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c;font-size:22px!important">Grand Total</td>\
        <td align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c">$19.95</td>\
        <td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td>\
        </tr>\
        </tbody></table>\
        </td>\
        </tr>\
        </tbody>\
        </table>\
        <div style="width:auto;padding:30px;text-align:center;background:#141414;color:#e9e9e9;text-align:center;margin-top:20px">Thank you For Your Purchase Order</div>\
        </div>\
        </td>\
        </tr>\
        </tbody></table>\
            </div>\
            <div style="width:100%; padding:10px;">\
            <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
            <div style="display:block; width:100%; text-align:center;">\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
            </div>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
            </div>\
            </div>\
            </div>\
            </body>\
        </html>';

    }
    if(type=='dealerpackagepurchase') {
        var subject = "DEALER SUBSCRIPTION PURCHASE PAYMENT SUCCESSFUL";
        var html='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
            <html xmlns="http://www.w3.org/1999/xhtml">\
            <head>\
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
            <title>Retail customer connect</title>\
        </head>\
            <body>\
            <div style="width:640px; margin:0 auto; background:#f9f0e1; padding:20px;">\
            <div style="width:620px;">\
            <div style="width:100%; background:#fff; padding:10px; border-bottom:solid 1px #ccc; box-shadow:0 0 10px #888;">\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#fff; padding:20px; border-bottom:solid 2px #fb4a32;">\
            <tr>\
            <td align="left" valign="middle"><img src="http://probiddealer.influxiq.com/images/customermaillogo.png"  alt="#" width="250"/></td>\
            <td align="right" valign="middle" style="font-size:14px; color:#000; line-height:30px;"> <span>455 Lorem Ipsum, AZ 85004, US <img src="http://probiddealer.influxiq.com/images/mail_location.png"  style="margin-left:5px;"/></span><br />\
            <span><a href="mailto:loremIpsum@mail.com" style="color:#000; text-decoration:none;">loremIpsum@mail.com </a><img src="http://probiddealer.influxiq.com/images/mail_mailinfo.png" style="margin-left:5px;"/></span><br />\
            <span><a href="tel:(000) 000-0000" style="color:#000; text-decoration:none;">(000) 000-0000 </a><img src="http://probiddealer.influxiq.com/images/mail_phone.png" style="margin-left:5px;"/></span> </td>\
            </tr>\
            </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody><tr>\
            <td align="center">\
            <div style="margin:0 auto;font-family:Arial,Helvetica,sans-serif;background:#fff">\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:40px 0;font-family:Arial,Helvetica,sans-serif">\
            <tbody>\
            <tr>\
            <td align="left" valign="top">\
            <div style="border-left:solid 6px #fb4a32;padding:6px 6px 6px 10px">\
            <h2 style="color:#555;font-size:18px;font-weight:normal;margin:0;padding:0px;display:inline-block">Invoice to:</h2>\
        <br>\
        <h3 style="font-weight:normal;margin:5px 0 8px 0;padding:0px;font-size:22px;color:#fb4a32;display:inline-block">'+items[0].fname+' '+items[0].lname+'</h3>\
        <br>\
        <h4 style="font-weight:normal;margin:0;padding:0;font-size:14px;line-height:20px;color:#555555;display:inline-block; text-decoration:none;">'+items[0].address+' , '+items[0].city+' , '+items[0].state+' , '+items[0].zip+'<br /><a href="mailto:info@loremipsum.com" target="_blank" style="color:#555555; display:inline-block; text-decoration:none;">'+items[0].email+'</a></h4>\
        </div>\
        </td>\
        <td align="right" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody>\
            <tr>\
            <td align="right" valign="middle" style="padding:0 8px 0 0;color:#fb4a32;font-size:28px;text-transform:uppercase">Invoice No: '+invoice+'</td>\
        </tr>\
        <tr>\
        <td align="right" valign="middle" style="padding:2px 8px 0 0;color:#0f0f0f;font-size:14px">Invoice date:'+timeConverter(added_on)+'</td>\
        </tr>\
        <tr>\
        <td align="right" valign="middle" style="padding:15px 8px 0 0;color:#111;font-size:20px">Total amount:$'+values.cost_extra_member+'</td>\
        </tr>\
        </tbody>\
        </table>\
        </td>\
        </tr>\
        </tbody>\
        </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family:Arial,Helvetica,sans-serif">\
            <tbody><tr>\
            <th width="2%" align="left" valign="middle" style="background:#8c8c8c">&nbsp;</th>\
        <th width="47%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Package Name</th>\
        <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="9%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"> Price</th>\
            <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="8%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Free Subscription</th>\
            <th width="5%" align="left" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal"><img src="http://www.probidtech.influxiq.com/images/arrowimgupdate.png" alt="#"></th>\
            <th width="16%" align="center" valign="middle" style="background:#8c8c8c;padding:8px 10px;font-size:16px;font-weight:bold!important;color:#fff;font-weight:normal">Total </th>\
            <th width="2%" align="left" valign="middle" style="background:#8c8c8c">&nbsp;</th>\
        </tr>\
            <tr>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="left" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">'+values.name+'</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$'+values.cost_extra_member+'</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">'+values.free_member
            +'</td>\
            <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        <td align="center" valign="middle" style="padding:8px 10px;font-size:16px;color:#111;font-weight:normal;border-bottom:solid 2px #9e9b9b">$'+values.cost_extra_member+'</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b;">&nbsp;</td>\
        </tr>\
        </tbody>\
        </table>\
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0px;margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;color:#333">\
            <tbody><tr>\
            <td width="100%"><table width="100%" border="0" cellspacing="0" cellpadding="0">\
            <tbody><tr>\
            <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Subtotal</td>\
            <td align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$'+values.cost_extra_member+'</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        </tr>\
            <tr>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">Tax</td>\
            <td align="right" valign="middle" style="padding:5px;border-bottom:solid 2px #9e9b9b;font-family:Arial,Helvetica,sans-serif;font-size:18px!important">$0.00</td>\
        <td align="left" valign="middle" style="border-bottom:solid 2px #9e9b9b">&nbsp;</td>\
        </tr>\
        <tr>\
        <td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td>\
        <td width="62%" align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c;font-size:22px!important">Grand Total</td>\
        <td align="right" valign="middle" style="padding:5px;color:#fff;background:#8c8c8c">$'+values.cost_extra_member+'</td>\
        <td align="left" valign="middle" style="background:#8c8c8c">&nbsp;</td>\
        </tr>\
        </tbody></table>\
        </td>\
        </tr>\
        </tbody>\
        </table>\
        <div style="width:auto;padding:30px;text-align:center;background:#141414;color:#e9e9e9;text-align:center;margin-top:20px">Thank you For Your Purchase Order</div>\
        </div>\
        </td>\
        </tr>\
        </tbody></table>\
            </div>\
            <div style="width:100%; padding:10px;">\
            <h2 style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:30px; text-align:center; padding:0px; margin:20px 10px 15px 10px; color:#333; font-weight:normal; font-style:italic;">Checkout our Social media pages for latest updates:</h2>\
            <div style="display:block; width:100%; text-align:center;">\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon1.png"  alt="#" style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon2.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon3.png"  alt="#"  style="margin:5px;"/></a>\
            <a href="javascript:void(0)"><img src="http://probiddealer.influxiq.com/images/mailicon4.png"  alt="#"  style="margin:5px;"/></a>\
            </div>\
            <h3  style="text-align:center; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:20px; text-align:center; padding:0px; margin:10px 20px 10px 20px; color:#333; font-weight:normal;"> Copyright © 2016-2017 probidauto. All rights reserved.</h3>\
            </div>\
            </div>\
            </div>\
            </body>\
        </html>';

    }

    var smtpTransport = mailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            user: "itplcc40@gmail.com",
            pass: "DevelP7@"
        }
    });

    var mail = {
        from: "Admin <samsujdev@gmail.com>",
        to: email,
        subject: subject,
        //text: "Node.js New world for me",
        html: html
    }

    smtpTransport.sendMail(mail, function (error, response) {
        //resp.send((response.message));
        smtpTransport.close();
    });

}

function timeConverter(UNIX_timestamp){
    // var a = new Date(UNIX_timestamp * 1000);
    var a = new Date(UNIX_timestamp);
    // var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    // var month=a.getMonth();
    var month = months[a.getMonth()];
    var date = a.getDate()+1;
    // var date = a.getDate()+1;
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = month + ' ' + date + ',  ' + year ;
    return time;
}

var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})