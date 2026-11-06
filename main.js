(function () {
  'use strict';

  var QI = window.QI;
  var params = new URLSearchParams(window.location.search);

  function param(short, long) {
    return params.get(short) || params.get(long) || '';
  }

  var guest = {
    name: QI.clean(param('n', 'name'), 80),
    date: QI.clean(param('d', 'date'), 40),
    time: QI.clean(param('t', 'time'), 20)
  };

  var initialLang = param('l', 'lang') === 'en' ? 'en' : 'ka';

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function applyLanguage(lang) {
    var t = QI.texts[lang] || QI.texts.ka;
    document.documentElement.setAttribute('lang', lang);
    document.title = guest.name ? t.title + ' — ' + guest.name : t.title;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (typeof t[key] === 'string') el.textContent = t[key];
    });

    setText('greeting', guest.name ? t.hello + ', ' + guest.name : t.hello);

    var dateText = QI.formatDate(guest.date, lang);
    var timeText = QI.formatTime(guest.time);
    setText('dateValue', dateText);
    setText('timeValue', timeText);
    document.getElementById('rowDate').hidden = !dateText;
    document.getElementById('rowTime').hidden = !timeText;

    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  function initLangSwitch() {
    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLanguage(btn.getAttribute('data-lang'));
      });
    });
  }

  /* Calendar file: Tbilisi is UTC+4 all year, so convert to UTC directly. */
  function icsStamp(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear() + QI.pad(d.getUTCMonth() + 1) + QI.pad(d.getUTCDate()) +
      'T' + QI.pad(d.getUTCHours()) + QI.pad(d.getUTCMinutes()) + '00Z';
  }

  function icsEscape(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }

  function initCalendar() {
    var btn = document.getElementById('calendarBtn');
    var d = QI.parseDate(guest.date);
    var t = QI.parseTime(guest.time);
    if (!d || !t) { btn.hidden = true; return; }

    btn.addEventListener('click', function () {
      var lang = document.documentElement.lang === 'en' ? 'en' : 'ka';
      var tx = QI.texts[lang];
      var start = Date.UTC(d.y, d.m - 1, d.d, t.h - 4, t.min);
      var end = start + 2 * 60 * 60 * 1000;

      var ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Qalaqshi//Invitation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:' + start + '-presentation@qalaqshi',
        'DTSTAMP:' + icsStamp(Date.now()),
        'DTSTART:' + icsStamp(start),
        'DTEND:' + icsStamp(end),
        'SUMMARY:' + icsEscape(tx.calTitle),
        'LOCATION:' + icsEscape(tx.calPlace),
        'URL:https://maps.app.goo.gl/WaWc8voqUiJobctx8',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      if (isIOS) {
        window.location.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
      } else {
        var a = document.createElement('a');
        a.href = url;
        a.download = 'qalaqshi-invitation.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLanguage(initialLang);
    initLangSwitch();
    initCalendar();
  });
})();
