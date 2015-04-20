/*
**************************************************************************************************************************
** CORAL Authentication Module v. 1.0
**
** Copyright (c) 2010 University of Notre Dame
**
** This file is part of CORAL.
**
** CORAL is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
**
** CORAL is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License along with CORAL.  If not, see <http://www.gnu.org/licenses/>.
**
**************************************************************************************************************************
*/
function getCookie(clave){ 
    var valCookie= ""; 
    var buscar= clave + "="; 
    if(document.cookie.length > 0) { 
        pos=document.cookie.indexOf(buscar); 
        if (pos != -1) {
            pos += buscar.length; 
            fin= document.cookie.indexOf(";", pos); 
            if (fin == -1) 
                fin= document.cookie.length; 
            valCookie= unescape(document.cookie.substring(pos,fin)) 
        }
    } 
    return valCookie; 
} 

function fLang() {
    var langBrowser = '';
    // Search the language according to the browser
    if(getCookie('lang')=='' || getCookie('lang')==undefined){
        if (navigator.languages==undefined) {
            if (navigator.language==undefined) {
                // Internet Explorer Compatibility
                langBrowser= navigator.userLanguage.slice(0,2);
            } else {
                // Old navigator compatibility
                langBrowser= navigator.language.slice(0,2);
            }
        } else { 
            // Recent navigators
            langBrowser= navigator.languages[0].slice(0,2);                                
        }
    }else{
        langBrowser = getCookie('lang');
    }
    return langBrowser;
}
var gt = "";//gt = new Gettext({ 'domain' : 'messages' });
function _(msgid) {
    return gt.gettext(msgid);
}

$(document).ready(function(){

	updateUsers();

});
 


function updateUsers() {

  $.ajax({
	 type:       "GET",
	 url:        "ajax_htmldata.php",
	 cache:      false,
	 data:       "action=getUsers",
	 success:    function(html) {
		$("#div_users").html(html);
		tb_reinit();
		bind_removes();
	 }


  }); 
}

  
function submitUserForm(){
  if (validateForm() === true) {
	// ajax call to add/update
	$.post("ajax_processing.php?action=submitUser", { loginID: $("#textLoginID").val(), editLoginID: $("#editLoginID").val(), password: $("#password").val(), adminInd: getCheckboxValue('adminInd')  } ,
		function(data){

			tb_remove();		
			updateUsers();
			return false;
			
		}
	);


	return false;
  
  }
}  

function validateForm (){
    var control=true;
    if (($("#textLoginID").val() == '') && (($("#password").val() == ''))){
        $("#span_errors").html(_("UserID is required"));
        control = false;
    }
    if (($("#password").val() != '') && ($("#password").val() != $("#passwordReenter").val())){
        $("#span_errors").html(_("Passwords do not match"));
        $("#passwordReenter").focus();
        control = false;
    }
    return control;
   }

  function bind_removes(){
      gt = new Gettext({ 'domain' : 'messages' });

  	 $(".deleteUser").unbind('click').click(function () {
	  if (confirm(_('Login')) == true) {
		  $.ajax({
			 type:       "GET",
			 url:        "ajax_processing.php",
			 cache:      false,
			 data:       "action=deleteUser&loginID=" + $(this).attr("id"),
			 success:    function(html) { 
				 updateUsers();
			 }



		 });
	  }			
  	 });
  }