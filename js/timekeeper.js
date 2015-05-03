(function(){
	var app = angular.module('timekeeper', ['ngMaterial']);

	app.config(function($mdThemingProvider){
		$mdThemingProvider.theme('default')
			.primaryPalette('teal');
	});

	app.controller('CalenderController', function(){
		this.days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
		this.daysXs = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
		this.daysXxs = ["L", "M", "M", "J", "V", "S", "D"];

		this.numberOfDays = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];

		this.month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
		this.monthXs = ["JAN", "FEV", "MAR", "AVR", "MAI", "JUI", "JUI", "AOU", "SEP", "OCT", "NOV", "DEC"];

		this.years = [];

		for(var i = 1900; i < 2200; i++){
			this.years.push(i);
		};

		//Empty days at January 2015
		this.emptyDays = [];

		
		//Today date
		this.fullDate = new Date();

		//Keep today date, don't change it
		this.date = this.fullDate.getDate();
		this.realMonthNumber = this.fullDate.getMonth();
		this.realYear = this.fullDate.getFullYear();

		//Variables: they are display between nice calendar and calendar
		this.monthNumber = this.realMonthNumber;
		this.year = this.realYear;

		//Selection variables
		this.selectedDate = this.date;
		this.selectedMonth = this.monthXs[this.monthNumber % 12];
		this.selectedMonthLong = this.month[this.monthNumber % 12];

		this.selectedMonthNumber = this.monthNumber;
		this.selectedYear = this.year;

		this.getSelectedDateForTask = function(){
			return this.selectedDate + "/" + this.selectedMonthNumber + "/" + this.selectedYear;
		};


		/*

			//Initilisation

		*/

		this.getNumberOfDays = function(){
			return new Array(parseInt(this.numberOfDays[this.monthNumber % 12]));
		};
		this.getMonth = function(){
			return this.month[this.monthNumber % 12];
		};

		this.isActualDay = function(date){
			if(date == this.date && this.realMonthNumber == this.monthNumber && this.realYear == this.year){
				return true;
			} else{
				return false;
			}
		};

		this.isSelected = function(date){
			if(date == this.selectedDate && this.monthNumber == this.selectedMonthNumber && this.year == this.selectedYear){
				return true;
			} else{
				return false;
			}
		};

		this.getEmptyDays = function(){
			return new Array(this.emptyDays[0]);
		};

		//Get empty days from January 2015 to actual month
		this.setEmptyDays = function(){
			//Difference between month = January 2015 and now
			var year = 2015;
			var yearDifference = this.year - year;
			var totalMonths = (yearDifference * 12) + this.monthNumber;
			var initEmptyDays = 3;

			for(var i = 0; i < totalMonths; i++){
				initEmptyDays = (parseInt(this.numberOfDays[i % 12]) + initEmptyDays) % 7; 
			}

			this.emptyDays.push(initEmptyDays, initEmptyDays);
		};

		this.setEmptyDays();
		this.selectedDay = this.days[(this.selectedDate - 1 + this.emptyDays[0]) % 7];


		//Set style at good looking calendar
		document.getElementById("gday").style.bottom = ((this.date - 1 + this.emptyDays[0]) % 7) * 30 + "px";
		document.getElementById("gmonth").style.bottom = this.realMonthNumber * 30 + "px";
		document.getElementById("gdate").style.bottom = (this.date - 1) * 70 + "px";
		document.getElementById("gyear").style.bottom = (this.year - 1900) * 30 + "px";


		/*

			//Event Listeners

		*/


		//NExt MONTH
		this.nextMonth = function(){

			//Calculate empty days. Need to know when the last day is in the week
			//Calculate before month is changing
			this.emptyDays[0] = (parseInt(this.numberOfDays[this.monthNumber % 12]) + this.emptyDays[0]) % 7;

			//Change montnumber variable, year and february days
			this.monthNumber++;
			//New year
			if(this.monthNumber % 12 == 0){
				this.year++;
				//Special year : feb = 29 days
				if(this.year % 4 == 0){
					this.numberOfDays[1] = "29";
				} else{
					this.numberOfDays[1] = "28";
				}
			}
		};

		//Previous MONTH
		this.previousMonth = function(){

			if(this.monthNumber == 0){
				this.monthNumber = 11;
			} else{
				this.monthNumber--;
			}
			//New year
			if(this.monthNumber % 12 == 11){
				this.year--;
				//Special year : feb = 29 days
				if(this.year % 4 == 0){
					this.numberOfDays[1] = "29";
				} else{
					this.numberOfDays[1] = "28";
				}
			}

			//Calculate empty days
			this.emptyDays[0] = (35 - parseInt(this.numberOfDays[this.monthNumber % 12]) + this.emptyDays[0]) % 7;
		};

		//Select day
		this.selectDay = function(date){
			
			//JS animation
			var actualDate = (this.selectedDate - 1 + this.emptyDays[1]) % 7;
			var newDate = (date - 1 + this.emptyDays[0]) % 7;


			if(this.selectedDay != this.days[newDate]){
				var newStyleDay = newDate * 30;
				var pxDay;
				
				var moveDay = setInterval(function(){
						pxDay = document.getElementById("gday").style.bottom;
						pxDay = parseInt(pxDay.substring(0, pxDay.length - 2));
						
						if(actualDate > newDate){
							pxDay -= 10;
						} else{
							pxDay += 10;
						}
						document.getElementById("gday").style.bottom = pxDay + "px";
						if(pxDay == newStyleDay){
							clearInterval(moveDay);
						}
					}, 50);

				this.selectedDay = this.days[newDate];
			}


			
			if(this.selectedMonthNumber != this.monthNumber){

				var actualMonth = this.selectedMonthNumber % 12;
				var newMonth = this.monthNumber % 12;

				var newStyleMonth = newMonth * 30;
				var pxMonth;
				
				var moveMonth = setInterval(function(){
					//console.log(newStyleMonth);
					pxMonth = document.getElementById("gmonth").style.bottom;
					pxMonth = parseInt(pxMonth.substring(0, pxMonth.length - 2));

					if(actualMonth > newMonth){
						pxMonth -= 10;
						console.log("+");
					} else{
						pxMonth += 10;
						console.log("-");
					}
					document.getElementById("gmonth").style.bottom = pxMonth + "px";
					if(pxMonth == newStyleMonth){
						clearInterval(moveMonth);
					}
				}, 50);

				this.selectedMonthNumber = this.monthNumber;
			}



			if(this.selectedDate != date){
				//actualDate is already used
				var actualDate2 = this.selectedDate;
				var newStyleDate = (date - 1) * 70;
				var pxDate;

				//Set time in comparison with difference between dates
				var intervalTime = date - actualDate2;
				if(intervalTime < 0){
					intervalTime *= -1;
				}
				intervalTime = Math.round(1/(intervalTime/30));
				console.log(Math.round(1/(intervalTime * 30)));
				/*
				if(intervalTime < 7 && intervalTime > -7){
					intervalTime = 50;
					console.log("7");
				} else if(intervalTime < 14 && intervalTime > -14){
					intervalTime = 30;
					console.log("14");
				} else if(intervalTime < 21 && intervalTime > -21){
					intervalTime = 20;
					console.log("21");
				} else{
					intervalTime = 10;
					console.log("else");
				}
				*/


				var moveDate = setInterval(function(){
					pxDate = document.getElementById("gdate").style.bottom;
					pxDate = parseInt(pxDate.substring(0, pxDate.length - 2));

					if(actualDate2 > date){
						pxDate -= 10;
					} else{
						pxDate += 10;
					}
					document.getElementById("gdate").style.bottom = pxDate + "px";

					if(pxDate == newStyleDate){
						clearInterval(moveDate);
					}

				}, intervalTime);

				this.selectedDate = date;
			}
			if(this.selectedYear != this.year){

				var actualYear = this.selectedYear;
				var newYear = this.year;
				var newStyleYear = (newYear - 1900) * 30;
				var pxYear;

				console.log(newStyleYear);

				var moveYear = setInterval(function(){
					pxYear = document.getElementById("gyear").style.bottom;
					pxYear = parseInt(pxYear.substring(0, pxYear.length - 2));

					if(actualYear > newYear){
						pxYear -= 10;
					} else{
						pxYear += 10;
					}
					document.getElementById("gyear").style.bottom = pxYear + "px";

					if(pxYear == newStyleYear){
						clearInterval(moveYear);
					}
				}, 100);

				this.selectedYear = this.year;
			}


			this.selectedMonth = this.month[this.monthNumber % 12];
			this.selectedMonthLong = this.month[this.monthNumber % 12];
			this.emptyDays[1] = this.emptyDays[0];
		};


		/*


					TASKS 


		*/


		this.getHours = function(){
			return new Array(24);
		};

	});//Controller Calendar



	app.controller('TaskController', function(){

		this.task = null;
		this.comment = null;

		this.tasks = [
			{ 	
				date : "1/4/2015",
				from : 1,
				to : 2,
				task : "STP driver / developpement",
				comment : "Liste utlime de tâches effectués",
				duree : 22
			},
			{ 	
				date : "20/04/2015",
				from : 4,
				to : 2,
				task : "STP driver / developpement",
				comment : "Liste utlime de tâches effectués",
				duree : 22
			}


		];


		this.isTask = function(hour, date){
			var task = this.tasks.filter(function(el){
				return el.from == hour && el.date == date;
			});
			
			if(task.length == 1){
				this.task = task[0].task;
				this.comment = task[0].comment;
				return true;
			}
		};

		this.getTask = function(){
			return this.task;
		};

		this.getComment = function(){
			return this.comment;
		};

		



	});




})();