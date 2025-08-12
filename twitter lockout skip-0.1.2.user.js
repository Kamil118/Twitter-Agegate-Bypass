// ==UserScript==
// @name         twitter lockout skip
// @description  Bypasses the age check gate by embedding media accessed using fixtwitter api upon pressing hotkey
// @version      0.1.2
// @author       Kamil118
// @match        https://x.com/*
// @grant        GM.xmlHttpRequest
// @connect      api.fxtwitter.com
// ==/UserScript==


(function() {
    'use strict';
    console.log("test, twitter")
    var agetext = "Age-restricted adult content. This content might not be appropriate for everyone. To view this media, you’ll need to verify your age to your profile. X also uses your age to show more relevant content, including ads, as explained in our Privacy Policy."
    var apiaddress = "api.fxtwitter.com"
    var hotkey_code = 0xC0


    function getfixapi()
{
    var newurl = window.location.href.replace("x.com", apiaddress)
    GM.xmlHttpRequest({
        method: "GET",
        url: newurl,
        onload: (response) =>
            {

                try
                {
                    var res = JSON.parse(response.responseText)
                    var media = res.tweet.media.all
                    console.log(media)


                    var matchingElement;
                    const elements = document.querySelectorAll('*');
                    for (const element of elements) {
                        if (element.innerText === agetext) {
                            matchingElement = element;
                            break;
                        }
                    }
                    console.log(matchingElement)
                    var censored_text = matchingElement.parentNode.parentNode;
                    var gp = censored_text.parentNode;
                    censored_text.remove();
                    var frame = gp.firstChild.firstChild
                    frame.innerHtml = ""
                    for(const med of media)
                    {
                        var el
                        if(med.type === "video")
                        {
                            el = document.createElement("video")
                            el.setAttribute("controls","")
                            var src = document.createElement("source")
                            src.setAttribute("src", med.url)

                            el.appendChild(src)
                        }
                        else
                        {
                            el = document.createElement("img")
                            el.setAttribute("src", med.url)
                        }

                        frame.appendChild(el)
                    }
                    console.log(frame)
                }
                catch(e){
                console.log("twitter lockout skip exception:",e)
                }

        }
    })

}


    var results = document.URL;
    window.addEventListener('keyup', function(event) {
        if(event.keyCode == 0xC0)
        {
            if(document.body.innerHTML.search(agetext) > 0)
            {
                try
                {
                getfixapi()
                }
                catch(e){
                console.log("twitter lockout skip exception:",e)
                }
            }
        }
    })
})();