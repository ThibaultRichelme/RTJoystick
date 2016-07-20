           /*

           		Project Name: RTJoystick
           		Author: Thibault Richelmme
           		Date: 20/06/1976
           		Description: RTJoystick provides a Joystick widget to include in webpages for controlling robot 
           
           */
           
           
           
           
 	 		function Joystick() 
 	 		{

				var g_mouseDown = false;
				var g_mouseMove = false;
				var g_canvas;
				var g_context;
				var g_message;
				var g_link;
				var g_canvasHeight;
				var g_canvasWidth;
				var g_widgetData;
				var g_speedLevels;
				var g_mousePos;
				var g_errorMessage;
				var g_showWidgetData;
				var g_debug;	
				var g_debugConsole;
				var g_debugConsoleCtx;
				var g_call;


				Joystick.prototype.initialize = function(canvasId, canvasHeight, canvasWidth, speedLevels, showWidgetValue, siteValue, debug) {
					
					g_canvas = document.createElement("canvas");
					g_canvas.id = canvasId;
					g_canvas.height = canvasHeight;
					g_canvas.width = canvasWidth;
					document.body.appendChild(g_canvas);
					g_context = g_canvas.getContext('2d');
					g_canvasHeight = g_canvas.height;
					g_canvasWidth = g_canvas.width;
					g_canvas.addEventListener('mousemove', onMouseMove, false);
					g_canvas.addEventListener('mousedown', onMouseDown, false);
					g_canvas.addEventListener('mouseup', onMouseUp, false);
					g_canvas.addEventListener('mouseout', onMouseOut, false);
					g_speedLevels = speedLevels;
					g_showWidgetData = showWidgetValue;
					g_link = siteValue; //Ajax post to server with values
					g_debug = debug;
									
					if (g_showWidgetData) {
						g_debugConsole = document.createElement("canvas");
						g_debugConsole.id = "debugJoystick";
						g_debugConsole.height = canvasHeight;
						g_debugConsole.width = canvasWidth;
						document.body.appendChild(g_debugConsole);
						g_debugConsoleCtx = g_debugConsole.getContext('2d');	
					}
					
					return initializeWidget.call(this);
				}

				Joystick.prototype.getData = function() 
				{
					return getWidgetData.call(this);
				}
				

				function getDebugInfosInConsole(e)
				{
					if(g_debug)
					console.log(e);		
				}	
								
				
				function onMouseMove(evt) {
					if (g_mouseDown) 
					{
						g_mousePos = getMousePos(g_canvas, evt);
						redrawWidget();		            
						postWidgetData(getLink() + getWidgetDataAsUrlParameters());
					}
				}

				
				function onMouseDown(evt) {
					g_mouseDown = true;
				}
	
				
				function onMouseUp(evt) {
					g_mouseDown = false;
					initializeWidget.call(this);
					postWidgetData(getLink() + getWidgetDataAsUrlParameters());
				}
	
				
				function onMouseOut(evt) {
					g_mouseDown = false;
					initializeWidget.call(this);
					postWidgetData(getLink() + getWidgetDataAsUrlParameters());
				}
	
				
				function initializeWidget() {
					try {
						g_mousePos = {
							x: (g_canvasHeight / 2),
							y: (g_canvasWidth / 2)
						};
						g_widgetData = getWidgetData(g_canvas, g_mousePos);
						drawWidget(g_canvas, getWidgetDataToString(), g_mousePos);
						return true;
					} catch (e) {
						g_errorMessage = "Error : initializeWidget() : ";
						getDebugInfosInConsole(g_errorMessage + e);
						return false;
					}
				}

				function redrawWidget() {
					try {
						g_widgetData = getWidgetData(g_canvas, g_mousePos);
						drawWidget(g_canvas, getWidgetDataToString(), g_mousePos);
					} catch (e) {
						g_errorMessage = "Error : redrawWidget() : ";
						getDebugInfosInConsole(g_errorMessage + e);
						initializeWidget();
					}
				}
	
				function getErrorMessage() {
					return g_errorMessage;
				}
				
				
				function getWidgetDataAsUrlParameters()
				{
					return "?direction=" + getWidgetData().direction + '&angle=' + getWidgetData().angle + '&speed=' + getWidgetData().speed;
				}

				function postWidgetData(url) {
			
					var httpRequest = false;
			
					if (window.XMLHttpRequest) { // Crossbrowser
						httpRequest = new XMLHttpRequest();
						if (httpRequest.overrideMimeType) {
							httpRequest.overrideMimeType('text/xml');
						}
					}
						
					if (!httpRequest) {
						g_errorMessage = "Error : postWidgetData() : " ;
						getDebugInfosInConsole(g_errorMessage + e);
						return false;
					}
					
					httpRequest.onreadystatechange = function() { onPostWidgetDataEvent(httpRequest); };
					httpRequest.open('POST', url, true);
					httpRequest.send(null);	
				}
				

				function onPostWidgetDataEvent(httpRequest) {
			
					if (httpRequest.readyState == 4) {
						if (httpRequest.status == 200) {							
							getDebugInfosInConsole(httpRequest.status);
						} else {
							g_errorMessage = "Error : onPostWidgetDataEvent() : ";
							getDebugInfosInConsole(g_errorMessage + httpRequest.status);
						}
					}
				}
 		    

				function drawWidget(canvas, message, mousePos) {
	
					var context = canvas.getContext('2d');
					context.clearRect(0, 0, canvas.width, canvas.height);
	
					//Vertical Line
					context.beginPath();
					context.lineWidth = 5;
					context.strokeStyle = '#000000';
					context.stroke();
					context.moveTo(canvas.width / 2, 0);
					context.lineTo(canvas.width / 2, canvas.height);
					context.stroke();
	
					//Horizontal Line
					context.beginPath();
					context.lineWidth = 5;
					context.strokeStyle = '#000000';
					context.stroke();
					context.moveTo(0, canvas.height / 2);
					context.lineTo(canvas.width, canvas.height / 2);
					context.stroke();
	
					//Joystick Circle
					var radiusBasis = canvas.height / 2;
					var radiusHandle = canvas.height / 6;
					var radiusHandleBasis = canvas.height / 8;
	
					context.beginPath();
					context.arc(canvas.height / 2, canvas.width / 2, radiusBasis - 5, 0, 2 * Math.PI, false);
					context.lineWidth = 5;
					context.strokeStyle = '#000000';
					context.stroke();
					context.closePath();
	
					//Joytisck basis
					context.beginPath();
					context.arc(canvas.height / 2, canvas.width / 2, radiusHandleBasis, 0, 2 * Math.PI, false);
					context.lineWidth = 5;
					context.fillStyle = 'black';
					context.fill();
					context.strokeStyle = '#000000';
					context.stroke();
					context.closePath();
	
					//Handle
					context.beginPath();
					context.moveTo(canvas.height / 2, canvas.width / 2, 0);
					context.lineTo(mousePos.x, mousePos.y);
					context.stroke();
					context.lineWidth = canvas.height / 8;
					context.strokeStyle = '#000000';
					context.stroke();
					context.closePath();
	
					//Red ball handle
					context.beginPath();
					context.arc(mousePos.x, mousePos.y, radiusHandle - 5, 0, 2 * Math.PI, false);
					context.lineWidth = 1;
					context.strokeStyle = '#000000';
					context.stroke();
					context.fillStyle = 'red';
					context.fill();
					context.closePath();
	
					if (g_showWidgetData) 
					{
						g_debugConsoleCtx.clearRect(0, 0, canvas.width, canvas.height);
						g_debugConsoleCtx.font = '12pt Calibri';
						g_debugConsoleCtx.fillStyle = '#000000';
						g_debugConsoleCtx.fillText(message, 10, 25);
					}	
				}

 		    
 		    //Return all calculated data in an Object
 		    function getWidgetData() {
 		        try {
 		     
 		            var cartesianCoords = getMouseCartesianPos(g_canvas, g_mousePos);
 		            var radius = getRadius(g_canvas, cartesianCoords);
 		            var speed = getSpeedLevel(g_speedLevels, g_canvas, radius);
 		            var direction = getDirection(cartesianCoords, speed);
 		            var angle = getAngleDirection(radius, cartesianCoords);
 		            var link = getLink();

 		            return {
 		                coordx: cartesianCoords.x,
 		                coordy: cartesianCoords.y,
 		                direction: direction,
 		                speed: speed,
 		                angle: angle,
 		                radius: radius,
 		                link: link
 		            };
 		        } catch (e) {
 		            g_errorMessage = "Error : getWidgetData() : ";
 		            getDebugInfosInConsole(g_errorMessage + e);
 		            return {
 		                coordx: 0,
 		                coordy: 0,
 		                direction: 0,
 		                speed: 0,
 		                angle: 0,
 		                radius: 0,
 		                link: ""
 		            };
 		        }
 		    }

 		    
 		    //Return object to a String
 		    function getWidgetDataToString() {
 		        try {
 		            return widgetValues = g_widgetData.angle + ', ' + g_widgetData.coordx + ', ' + g_widgetData.coordy + ', ' + g_widgetData.direction + ', ' + g_widgetData.speed + ', ' + g_widgetData.radius;
 		        } catch (e) {
 		            g_errorMessage = "Error : getWidgetDataToString() : ";
 		            getDebugInfosInConsole(g_errorMessage + e);
 		            return "";
 		        }
 		    }

 		    
 		    //Get link to send data to Server
 		    function getLink() {
 		        try {
 		            return g_link;
 		        } catch (e) {
 		            g_errorMessage = "Error : getLink() : ";
 		            getDebugInfosInConsole(g_errorMessage + e);
 		            return "";
 		        }
 		    }
 		    

 		    //Convert Canvas MousePos to Cartesian pos
 		    function getMouseCartesianPos(widgetSides, mousePos) {
 		        try {
 		            var heigth = widgetSides.height / 2;
 		            var width = widgetSides.width / 2;
 		            return {
 		                x: mousePos.x - width,
 		                y: heigth - mousePos.y
 		            };
 		        } catch (e) {
 		            g_errorMessage = "Error : getMouseCartesianPos() : ";
 		            return {
 		                x: 0,
 		                y: 0
 		            };
 		        }
 		    }


 		    //Get Angle in the circle based on radius and vertical axe
 		    function getAngleDirection(radius, cartesianCoords) {
 		        try {
 		            if (radius == 0)
 		                return 0;

 		            var angleOH = Math.abs(cartesianCoords.x) / radius; // opposite/hypetnus
 		            var angle = Math.ceil(Math.asin(angleOH) * 180 / Math.PI);
 		            angle = Math.floor(angle / 10) * 10;


 		            return angle;
 		        } catch (e) {
 		            g_errorMessage = "Error : getAngleDirection() : ";
 		            return 0;
 		        }
 		    }


 		    //Get Canvas MousPos
 		    function getMousePos(canvas, evt) {
 		        try {
 		            var rect = canvas.getBoundingClientRect();
 		            return g_mousePos = {
 		                x: evt.clientX - rect.left,
 		                y: evt.clientY - rect.top
 		            };
 		        } catch (e) {
 		            g_errorMessage = "Error : getMousePos() : ";
 		            return {
 		                x: 0,
 		                y: 0
 		            };
 		        }
 		    }


 		    // Radius - Calculated based on right triangle in the circle - Pythagore
 		    function getRadius(widgetSides, cartesianCoords) {
 		        try {
 		            var coordX = cartesianCoords.x;
 		            var coordY = cartesianCoords.y;
 		            var radius = Math.sqrt(Math.pow(coordX, 2) + Math.pow(coordY, 2));
 		            var roundedRadius = Math.ceil(radius);

 		            if (roundedRadius > widgetSides.width / 2)
 		                roundedRadius = widgetSides.width / 2;

 		            return roundedRadius;
 		        } catch (e) {
 		            g_errorMessage = "Error : getRadius() : ";
 		            return 0;
 		        }
 		    }


 		    //Speed level based on radius length in circle
 		    function getSpeedLevel(speedLevels, widgetSideLength, radius) {
 		        try {
 		            var roundedRadius = radius;
 		            var speedLevel = widgetSideLength.width / speedLevels;
 		            var calcSpeed = Math.ceil(roundedRadius / speedLevel) - 1;

 		            if (calcSpeed < 0)
 		                calcSpeed = 0;

 		            return calcSpeed;
 		        } catch (e) {
 		            g_errorMessage = "Error : getSpeedLevel() : ";
 		            return 0;
 		        }
 		    }


 		    //Get direction in the circle based on polarity and speed
 		    function getDirection(cartesianCoords, speed) {
 		        try {
 		            var direction;
 		            var centerY = 0;

 		            if (cartesianCoords.y > centerY && speed != 0) {
 		                return direction = 2;
 		            } else if (cartesianCoords.y < centerY && speed != 0) {
 		                return direction = 1;
 		            } else if (cartesianCoords.y == centerY) {
 		                return direction = 0;
 		            } else if (speed == 0) {
 		                return direction = 0;
 		            }
 		        } catch (e) {
 		            g_errorMessage = "Error : getDirection() : ";
 		            return 0;
 		        }
 		    }
 		}