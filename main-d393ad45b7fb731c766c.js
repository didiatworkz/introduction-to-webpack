webpackJsonp([1],{14:function(n,e,r){e=n.exports=r(0)(void 0),e.push([n.i,".line{display:block}.line.focus{background:#555}.reveal .slides section .fragment.current-only{opacity:1;visibility:visible;display:none}.reveal .slides section .fragment.current-only.current-fragment{display:block}.reveal section img{border:none!important}p.horizontal-flex{align-items:center;display:flex;justify-content:space-around;flex-wrap:wrap}",""])},195:function(n,e){n.exports="/*!\r\n * reveal-code-focus 0.1.1\r\n * Copyright 2015-2016 Benjamin Tan <https://demoneaux.github.io/>\r\n * Available under MIT license <https://github.com/demoneaux/reveal-code-focus/blob/master/LICENSE>\r\n */\r\n;(function(window, Reveal, hljs) {\r\n  if (typeof window.RevealCodeFocus == 'function') {\r\n    return;\r\n  }\r\n\r\n  var currentSlide, currentFragments, scrollToFocused, prevSlideData = null;\r\n\r\n  function forEach(array, callback) {\r\n    var i = -1, length = array ? array.length : 0;\r\n    while (++i < length) {\r\n      callback(array[i]);\r\n    }\r\n  }\r\n\r\n  function indexOf(array, elem) {\r\n    var i = -1, length = array ? array.length : 0;\r\n    while (++i < length) {\r\n      if (array[i] === elem) {\r\n        return i;\r\n      }\r\n    }\r\n  }\r\n\r\n  var ran;\r\n  function init(e) {\r\n    // Initialize code only once.\r\n    // TODO: figure out why `init` is being called twice.\r\n    if (ran) {\r\n      return;\r\n    }\r\n    ran = true;\r\n\r\n    forEach(document.querySelectorAll('pre code'), function(element) {\r\n      // Trim whitespace if the `data-trim` attribute is present.\r\n      if (element.hasAttribute('data-trim') && typeof element.innerHTML.trim == 'function') {\r\n        element.innerHTML = element.innerHTML.trim();\r\n      }\r\n\r\n      // Highlight code using highlight.js.\r\n      hljs.highlightBlock(element);\r\n\r\n      // Split highlighted code into lines.\r\n      var openTags = [], reHtmlTag = /<(\\/?)span(?:\\s+(?:class=(['\"])hljs-.*?\\2)?\\s*|\\s*)>/g;\r\n      element.innerHTML = element.innerHTML.replace(/(.*?)\\r?\\n/g, function(_, string) {\r\n        if (!string) {\r\n          return '<span class=line>&nbsp;</span>';\r\n        }\r\n        var openTag, stringPrepend;\r\n        // Re-open all tags that were previously closed.\r\n        if (openTags.length) {\r\n          stringPrepend = openTags.join('');\r\n        }\r\n        // Match all HTML `<span>` tags.\r\n        reHtmlTag.lastIndex = 0;\r\n        while (openTag = reHtmlTag.exec(string)) {\r\n          // If it is a closing tag, remove the opening tag from the list.\r\n          if (openTag[1]) {\r\n            openTags.pop();\r\n          }\r\n          // Otherwise if it is an opening tag, push it to the list.\r\n          else {\r\n            openTags.push(openTag[0]);\r\n          }\r\n        }\r\n        // Close all opened tags, so that strings can be wrapped with `span.line`.\r\n        if (openTags.length) {\r\n          string += Array(openTags.length + 1).join('</span>');\r\n        }\r\n        if (stringPrepend) {\r\n          string = stringPrepend + string;\r\n        }\r\n        return '<span class=line>' + string + '</span>';\r\n      });\r\n    });\r\n\r\n    Reveal.addEventListener('slidechanged', updateCurrentSlide);\r\n\r\n    Reveal.addEventListener('fragmentshown', function(e) {\r\n      focusFragment(e.fragment);\r\n    });\r\n\r\n    // When a fragment is hidden, clear the current focused fragment,\r\n    // and focus on the previous fragment.\r\n    Reveal.addEventListener('fragmenthidden', function(e) {\r\n      var index = indexOf(currentFragments, e.fragment);\r\n      focusFragment(currentFragments[index - 1]);\r\n    });\r\n\r\n    updateCurrentSlide(e);\r\n  }\r\n\r\n  function updateCurrentSlide(e) {\r\n    currentSlide = e.currentSlide;\r\n    currentFragments = currentSlide.getElementsByClassName('fragment');\r\n    clearPreviousFocus();\r\n    if (\r\n        currentFragments.length &&\r\n        prevSlideData &&\r\n        (\r\n          prevSlideData.indexh > e.indexh ||\r\n          (prevSlideData.indexh == e.indexh && prevSlideData.indexv > e.indexv)\r\n        )\r\n    ) {\r\n      while (Reveal.nextFragment()) {}\r\n      var currentFragment = currentFragments[currentFragments.length - 1];\r\n      currentFragment.classList.add('current-fragment');\r\n      focusFragment(currentFragment);\r\n    }\r\n    // Update previous slide information.\r\n    prevSlideData = {\r\n      'indexh': e.indexh,\r\n      'indexv': e.indexv\r\n    };\r\n  }\r\n\r\n  // Remove\r\n  function clearPreviousFocus() {\r\n    forEach(currentSlide.querySelectorAll('pre code .line.focus'), function(line) {\r\n      line.classList.remove('focus');\r\n    });\r\n  }\r\n\r\n  function focusFragment(fragment) {\r\n    clearPreviousFocus();\r\n    if (!fragment) {\r\n      return;\r\n    }\r\n\r\n    var lines = fragment.getAttribute('data-code-focus');\r\n    if (!lines) {\r\n      return;\r\n    }\r\n\r\n    var code = currentSlide.querySelectorAll('pre code .line'),\r\n        codeParent, scrollLineTop, scrollLineBottom;\r\n\r\n    function focusLine(lineNumber) {\r\n      var line = code[lineNumber - 1];\r\n      if (!line) {\r\n        return;\r\n      }\r\n\r\n      line.classList.add('focus');\r\n\r\n      if (scrollLineTop == null) {\r\n        scrollLineTop = scrollLineBottom = lineNumber - 1;\r\n      } else {\r\n        scrollLineTop = Math.min(scrollLineTop, line.offsetTop);\r\n        scrollLineBottom = Math.max(scrollLineBottom, lineNumber - 1);\r\n      }\r\n    }\r\n\r\n    forEach(lines.split(','), function(line) {\r\n      lines = line.split('-');\r\n      if (lines.length == 1) {\r\n        focusLine(lines[0]);\r\n      } else {\r\n        var i = lines[0] - 1, j = lines[1];\r\n        while (++i <= j) {\r\n          focusLine(i);\r\n        }\r\n      }\r\n    });\r\n\r\n    if (scrollToFocused && scrollLineTop != null) {\r\n      codeParent = code[scrollLineTop].parentNode;\r\n      scrollLineTop = code[scrollLineTop].offsetTop;\r\n      scrollLineBottom = code[scrollLineBottom].offsetTop + code[scrollLineBottom].clientHeight;\r\n      codeParent.scrollTop = scrollLineTop - (codeParent.clientHeight - (scrollLineBottom - scrollLineTop)) / 2;\r\n    }\r\n  }\r\n\r\n  function RevealCodeFocus(options) {\r\n    options || (options = {\r\n      'scrollToFocused': true\r\n    });\r\n\r\n    if (options.scrollToFocused != null) {\r\n      scrollToFocused = options.scrollToFocused;\r\n    }\r\n\r\n    if (Reveal.isReady()) {\r\n      init({ currentSlide: Reveal.getCurrentSlide() });\r\n    } else {\r\n      Reveal.addEventListener('ready', init);\r\n    }\r\n  }\r\n\r\n  window.RevealCodeFocus = RevealCodeFocus;\r\n}(this, this.Reveal, this.hljs));\r\n"},196:function(n,e){n.exports=function(n){"undefined"!=typeof execScript?execScript(n):eval.call(null,n)}},199:function(n,e,r){!function(){"use strict";r(9),setTimeout(function(){window.Reveal.initialize({transition:"fade",history:!0}),r(4),window.RevealCodeFocus()},100)}()},4:function(n,e,r){r(196)(r(195))},9:function(n,e,r){var i=r(14);"string"==typeof i&&(i=[[n.i,i,""]]);var t={};t.transform=void 0;r(1)(i,t);i.locals&&(n.exports=i.locals)}},[199]);