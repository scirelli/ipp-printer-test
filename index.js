#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const ipp = require('ipp');
const PDFDocument = require('pdfkit');
const { buffer } = require('node:stream/consumers');  

//const URI = 'ipps://HP%20LaserJet%20Pro%20M404-M405%20%5B42FDA0%5D._ipps._tcp.local';
//const URI = 'ipp://HPC0180342FDA0.local:631/ipp/print';
//const URI = 'ipp://HP%20LaserJet%20Pro%20M404-M405%20%5B42FDA0%5D%20(USB)._ipp._tcp.local';
//const URI = 'ipp://cck-core.local:60000/ipp/print';
const URI = 'http://localhost:60000/ipp/print';

//make a PDF document
const doc = new PDFDocument({margin:0});
doc.text('Hello world!', 100, 100);
doc.end();

const buf = await buffer(doc);

 
const printer = ipp.Printer(URI);
const msg = {
    'operation-attributes-tag': {
        'requesting-user-name': 'William',
        'job-name': 'My Test Job',
        'document-format': 'application/pdf'
    },
    data: buf
};
printer.execute('Print-Job', msg, function(err, res){
	if(err){
		console.error(err);
		process.exit(1);
	}
	console.log(res);
});

/*
const data = ipp.serialize({
    'operation':'Get-Printer-Attributes',
    'operation-attributes-tag': {
        'attributes-charset': 'utf-8',
        'attributes-natural-language': 'en',
        'printer-uri': uri
    }
});
 
ipp.request(URI, data, function(err, res){
    if(err){
        return console.log(err);
    }
    console.log(JSON.stringify(res,null,2));
})
*/
