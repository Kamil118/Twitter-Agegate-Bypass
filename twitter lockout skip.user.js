// ==UserScript==
// @name         twitter lockout skip
// @description  Bypasses the age check gate by embedding media accessed using fixtwitter api upon pressing hotkey
// @version      0.3
// @author       Kamil118
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.5.2/arrive.min.js
// @match        https://x.com/*
// @grant        GM.xmlHttpRequest
// @connect      api.fxtwitter.com
// ==/UserScript==


(function() {
    'use strict';
    console.log("test, twitter")
    var agetext = "Age-restricted adult content. This content might not be appropriate for everyone. To view this media, you’ll need to verify your age to your profile. X also uses your age to show more relevant content, including ads, as explained in our Privacy Policy."
    var qrttext = "This post is unavailable."
    var apiaddress = "api.fxtwitter.com"
    var hotkey_code = 0xC0


    function findtweethead(element)
    {
        var e = element
        while(e.parentNode != document)
        {
            if(e.getAttribute("data-testid") == "tweet")
            {
                break;
            }
            e = e.parentNode
        }
        return e
    }

     function getfixapi2(element)
{

    var head = findtweethead(element)
    var aTags = head.getElementsByTagName("a")
    var url = null
    var url_list = []
    for(let aTag of aTags){
        let href = aTag.getAttribute("href")
        // Gets the value of the href attribute
        if(href.includes("/status/")){
            url_list.push("https://x.com" + href);
    }}
    if(url_list == [])
    {
        url = window.location.href;
    }
    else{
        url = url_list[url_list.length -1]
    }

    var newurl = url.replace("x.com", apiaddress)
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


                    var matchingElement = element
                    console.log(matchingElement)
                    var censored_text = matchingElement.parentNode.parentNode.parentNode;
                    var gp = censored_text.parentNode;
                    censored_text.remove();
                    var frame = gp.firstChild.firstChild
                    frame.innerHtml = ""
                    for(const med of media)
                    {
                        var el
                        if(med.type === "video" || med.type === "gif")
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

    function fixqrt(element)
    {
        var head = findtweethead(element)
    var aTags = head.getElementsByTagName("a")
    var url = null
    var url_list = []
    for(let aTag of aTags){
        let href = aTag.getAttribute("href")
        // Gets the value of the href attribute
        if(href.includes("/status/")){
            url_list.push("https://x.com" + href);
    }}
    if(url_list == [])
    {
        console.log("unable to find qrt link. This shouldn't happen")
        return
    }
    else{
        url = url_list[0]
    }

        var el = document.createElement("a")
        el.setAttribute("href",url)
        el.innerHTML = "Click here to try accessing quoted tweet"

        element.innerHTML = ""
        element.append(el)

}


    document.arrive('span.css-1jxf684',(element) => {
        console.log("found censored post")
        if(element.innerHTML === agetext)
        {
            console.log("autofound match")
            console.log(element)
            getfixapi2(element)
        }
    });
    document.arrive('span.css-1jxf684',(element) => {
        console.log("autofound element")
        if(element.innerHTML === qrttext)
        {
            console.log("found unavable qrt")
            console.log(element)
            fixqrt(element)
        }
    });
       
})();