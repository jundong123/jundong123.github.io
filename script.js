// glocal variables
var url00 = "https://gpsmet.umd.edu/sfr/sfr_v0";
var fdn00 = "image";
var sats = ["n19", "mob", "moc", "npp", "n20", "n21", "gps"];
var sfgs = [true, true, true, true, true, true, true];
var fls = [];
var dns = [];

var col2 = document.getElementById("col2");


// init web with today (utc) images
const zeroPad = (num, places) => String(num).padStart(places, '0')

var dttm = new Date();
//console.log(dttm);
ymdh = zeroPad(dttm.getUTCFullYear(),4) + zeroPad(dttm.getUTCMonth()+1,2)
        + zeroPad(dttm.getUTCDate(),2) + zeroPad(dttm.getUTCHours(),2);
//console.log(ymdh);

date = ymdh.substring(4,6) + "/" + ymdh.substring(6,8) + "/"
        +ymdh.substring(0,4);
//date = "03/20/2024";
//console.log(date);


/////////////////////////
// main
/////////////////////////

runOneday(date);

// add datepicker
$("#dtpk").datepicker({
    numberOfMonths: 1,
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    defaultDate: date,
    minDate: new Date(2020,0,1),
    maxDate: date,
    onSelect: function (date, evnt) {
        runOneday(date);
    }
});


/////////////////////////
// functions
/////////////////////////

// one day function
async function runOneday(date) {
    await getFilelist(date);
    sortFilelist();
    showImages();
    //console.log("Back runOneday");
    console.log(fls);
}


// get file list in array
async function getFilelist(date) {
    // date
    //console.log("In getFilelist");
    console.log(date);
    year = date.substring(6, 10);
    mon = date.substring(0, 2);
    day = date.substring(3, 5);

    re1 = "SFR_\\w+_S" + year + mon + day + "_\\w+.png";
    re = new RegExp(re1, "g");
    //console.log(re1, re);

    // get file list
    nsats = sats.length;
    fls = [];
    i1 = 0;
    for (i0=0; i0<nsats; i0++) {
		if (sfgs[i0]) {
        	sat = sats[i0];
            fdn01 = fdn00 + "/" + sat + "/" + year + mon;
        	url01 = url00 + "/" + fdn01;
        	console.log(url01);

	    	response = await fetch(url01);
            //console.log(response);

    		switch (response.status) {
	        	// status "OK"
    	    	case 200:
        	    	html1 = await response.text();
                    //html = html.concat(html1);
                    fls1 = html1.match(re);
                    if (fls1 === null) {
                        console.log("No any matched file.");
                    } else {
                        console.log("Find file: " + fls1.length);
                        fls[i1] = fls1;  dns[i1] = fdn01;  i1++;
                    }
                    break;
	        	// status "Not Found"
    	    	case 404:
        	    	console.log('Not Found');
                    break;
	    	}

		}
	}
    //console.log(fls);
    //console.log(dns);
}


// get file list
function sortFilelist() {
    // add path
    //console.log("In sortFilelist");
    nfls = fls.length;
    for (i0=0; i0<nfls; i0++) {
        nn = fls[i0].length;
        for (i1=0; i1<nn; i1++) {
            fls[i0][i1] = dns[i0] + "/" + fls[i0][i1];
        }
    }

    var re2 = /S[0-9]{8}_[0-9]{6}/;
    fls = fls.flat();
    fls = fls.sort(function (a, b) {
        return b.match(re2)[0].localeCompare(a.match(re2))
    });
    //console.log(fls);
}


// show images
function showImages() {
    //console.log("In showImages");
    nfls = fls.length;
    col2.innerHTML = "";
    for (i0=0; i0<nfls; i0++) {
        ss = "<img src= \"" + fls[i0] + "\" " + "width=560/>";
        col2.innerHTML = col2.innerHTML + ss;
    }
    //console.log(fls);
}




