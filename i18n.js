/* Shared texts and helpers for the invitation and the link maker. */
window.QI = (function () {
  'use strict';

  var texts = {
    ka: {
      title: 'მოსაწვევი · ქალაქში',
      eyebrow: 'პერსონალური მოსაწვევი',
      hello: 'გამარჯობა',
      p1: 'სასიამოვნოა, რომ შესაძლებლობა გვაქვს პირადად გაგაცნოთ „ქალაქში“-ს ახალი ტურისტული პროგრამა, რომელიც შექმნილია საქართველოში ჩამოსული სტუმრებისთვის და აერთიანებს ქართულ სამზარეულოს, კულტურას, მუსიკასა და ტრადიციებს ერთ გამოცდილებაში.',
      p2: 'გეპატიჟებით შეხვედრაზე, სადაც გაგაცნობთ პროგრამის კონცეფციას, ფორმატს და ტურისტულ კომპანიებთან თანამშრომლობის შესაძლებლობებს.',
      p3: 'სიამოვნებით გიმასპინძლებთ და პირადად გაგიზიარებთ ყველა დეტალს.',
      dateLabel: 'თარიღი',
      timeLabel: 'დრო',
      placeLabel: 'მისამართი',
      place: 'რესტორანი „ქალაქში“, გაგარინის 22',
      mapBtn: 'რუკაზე ნახვა',
      calendarBtn: 'კალენდარში დამატება',
      signoff: 'გელოდებით',
      months: ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'],
      days: ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'],
      calTitle: '„ქალაქში“ — ტურისტული პროგრამის პრეზენტაცია',
      calPlace: 'რესტორანი „ქალაქში“, გაგარინის 22, თბილისი'
    },
    en: {
      title: 'Invitation · Qalaqshi',
      eyebrow: 'Personal Invitation',
      hello: 'Hello',
      p1: 'We are delighted to have the opportunity to personally introduce Qalaqshi’s new tourism programme — created for guests visiting Georgia, it brings together Georgian cuisine, culture, music and traditions in a single experience.',
      p2: 'We would like to invite you to a meeting where we will present the programme’s concept, its format and the opportunities for cooperation with tour companies.',
      p3: 'It will be our pleasure to host you and share all the details in person.',
      dateLabel: 'Date',
      timeLabel: 'Time',
      placeLabel: 'Venue',
      place: 'Qalaqshi Restaurant, 22 Gagarin St.',
      mapBtn: 'View on Map',
      calendarBtn: 'Add to Calendar',
      signoff: 'We look forward to seeing you',
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      calTitle: 'Qalaqshi — Tourism Programme Presentation',
      calPlace: 'Qalaqshi Restaurant, 22 Gagarin St., Tbilisi'
    }
  };

  /* "2026-11-15" -> {y, m, d} or null */
  function parseDate(value) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var dt = new Date(Date.UTC(y, mo - 1, d));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
    return { y: y, m: mo, d: d, weekday: dt.getUTCDay() };
  }

  /* "14:00" -> {h, min} or null */
  function parseTime(value) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(value || '');
    if (!m) return null;
    var h = +m[1], min = +m[2];
    if (h > 23 || min > 59) return null;
    return { h: h, min: min };
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function formatDate(value, lang) {
    var t = texts[lang] || texts.ka;
    var p = parseDate(value);
    if (!p) return value || '';
    if (lang === 'en') {
      return t.days[p.weekday] + ', ' + t.months[p.m - 1] + ' ' + p.d + ', ' + p.y;
    }
    return t.days[p.weekday] + ', ' + p.d + ' ' + t.months[p.m - 1] + ', ' + p.y;
  }

  function formatTime(value) {
    var p = parseTime(value);
    if (!p) return value || '';
    return pad(p.h) + ':' + pad(p.min);
  }

  function clean(value, max) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max || 80);
  }

  return {
    texts: texts,
    parseDate: parseDate,
    parseTime: parseTime,
    formatDate: formatDate,
    formatTime: formatTime,
    clean: clean,
    pad: pad
  };
})();
