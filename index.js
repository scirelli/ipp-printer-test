#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const ipp = require('ipp');
const PDFDocument = require('pdfkit');
const { buffer } = require('node:stream/consumers');  

//const URI = 'ipps://HP%20LaserJet%20Pro%20M404-M405%20%5B42FDA0%5D._ipps._tcp.local';
//const URI = 'ipp://HPC0180342FDA0.local:631/ipp/print';
//const URI = 'ipp://HP%20LaserJet%20Pro%20M404-M405%20%5B42FDA0%5D%20(USB)._ipp._tcp.local';
//const URI = 'ipp://cck-core.local:60000/ipp/print'; //found with ippfind
const URI = 'http://localhost:60000/ipp/print'; //unless the hostname is mapped in the hosts file, use localhost

async function printAPage() {
	//make a PDF document
	const doc = new PDFDocument({margin:0});
	doc.text('Hello world!', 100, 100);
	doc.end();

	const buf = await buffer(doc);
	 
	return new Promise((resolve, reject)=>{
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
				return reject(err);
			}
			resolve(res);
		});
	});
}

const msg = {
		'operation':'Get-Printer-Attributes',
		'operation-attributes-tag': {
			'attributes-charset': 'utf-8',
			'attributes-natural-language': 'en',
			'printer-uri': URI
		}
	},
	msg2 = {
		'operation':'Get-Printer-Attributes',
		'operation-attributes-tag': {
			'attributes-charset': 'utf-8',
			'attributes-natural-language': 'en',
			'printer-uri': URI,
			'requested-attributes': [
				'queued-job-count',
				'marker-levels',
				'printer-state',
				'printer-state-reasons',
				'printer-up-time'
			]
		}
	};
 
ipp.request(URI, ipp.serialize(msg), function(err, res){
    if(err){
        return console.log(err);
    }
    console.log(JSON.stringify(res,null,2));
});

/*
"printer-uri-supported": "ipp://localhost:60000/ipp/print",
    "uri-security-supported": "none",
    "uri-authentication-supported": "requesting-user-name",
    "printer-settable-attributes-supported": "none",
    "printer-name": "hp42fda0",
    "printer-location": "",
    "printer-more-info": "http://localhost:60000/#hId-pgAirPrint",
    "printer-info": "HP LaserJet Pro M404-M405 [42FDA0]",
    "printer-dns-sd-name": "HP LaserJet Pro M404-M405 [42FDA0]",
    "printer-make-and-model": "HP LaserJet Pro M404-M405",
    "printer-state": "idle",
    "printer-state-reasons": "none",
    "printer-state-message": "",
    "ipp-versions-supported": [],
    "operations-supported": [
      "Print-Job",
      "Validate-Job",
      "Cancel-Job",
      "Cancel-My-Jobs",
      "Get-Job-Attributes",
      "Get-Jobs",
      "Get-Printer-Attributes",
      "Create-Job",
      "Send-Document",
      "Set-Printer-Attributes",
      16425,
      16426,
      "Print-URI",
      "Send-URI",
      "Close-Job",
      "Identify-Printer"
    ],

"printer-strings-uri": "http://localhost:60000/ipp/files/en.strings",
    "document-format-default": "application/octet-stream",
    "document-format-supported": [
      "application/vnd.hp-PCL",
      "application/vnd.hp-PCLXL",
      "application/postscript",
      "application/pdf",
      "image/jpeg",
      "image/urf",
      "image/pwg-raster",
      "application/PCLm",
      "application/octet-stream"
    ],
		"printer-up-time": 3267274,
    "printer-current-time": "1970-11-29T04:15:21.000Z",
"printer-device-id": "MFG:HP;MDL:HP LaserJet Pro M404-M405;CMD:PCL5c,PCLXL,POSTSCRIPT,PDF,PJL,Automatic,JPEG,AppleRaster,PWGRaster,PCLM,802.3,DESKJET,DYN;CLS:PRINTER;DES:W1A53A;CID:HPLJPDLV1;LEDMDIS:USB#FF#04#01;MCT:PR;MCL:DI;MCV:5.0;SN:PHDBH22417;S:038888C48400000100101000000;Z:05000001,12000,17000000,181;",
    "printer-alert": [],
		 "printer-alert-description": [],
		 "printer-uuid": "urn:uuid:2ed83c55-f841-5ec0-cca8-af11a03f336c",
		  "marker-names": "black cartridge",
    "marker-colors": "#000000",
    "marker-types": "toner-cartridge",
    "marker-low-levels": 2,
    "marker-high-levels": 100,
    "marker-levels": 90,
    "printer-supply": "type=tonerCartridge;maxcapacity=100;level=90;class=supplyThatIsConsumed;unit=percent;colorantname=black;",
    "printer-supply-description": "Black Cartridge",
    "printer-firmware-name": "MOGAMIXXXN002.2445A.00",
    "printer-firmware-string-version": "MOGAMIXXXN002.2445A.00",
    "printer-firmware-version": "MOGAMIXXXN002.2445A.00",
    "printer-input-tray": [
      "type=unRemovableBin;dimunit=micrometers;mediafeed=0;mediaxfeed=0;maxcapacity=-2;level=-2;unit=percent;status=19;name=Tray 1",
      "type=sheetFeedAutoNonRemovable;dimunit=micrometers;mediafeed=0;mediaxfeed=0;maxcapacity=-2;level=-2;unit=percent;status=0;name=Tray 2",
      "type=other;dimunit=micrometers;mediafeed=-2;mediaxfeed=-2;maxcapacity=-2;level=-2;unit=percent;status=0;name=auto"
    ],
    "printer-output-tray": "type=unknown;maxcapacity=-2;remaining=-2;status=5;stackingorder=unknown;pagedelivery=faceDown;name=OutputTray1",
"orientation-requested-default": "portrait",
    "print-quality-default": "normal",
"sides-default": "one-sided",
    "output-bin-default": "face-down",
  "printer-supply-info-uri": "http://localhost:60000/#hId-pgConsumables"


 */
