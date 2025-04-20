/**
 * 将日期对象格式化为指定格式的字符串
 * @param {Date} date - 日期对象
 * @param {string} format - 格式字符串
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format='yyyy-MM-dd') {
  if (!(date instanceof Date)) {
      throw new Error('Invalid date object');
  }
  
  const pad = (num) => num.toString().padStart(2, '0');
  const fullYear = date.getFullYear();
  const year = fullYear.toString().slice(-2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  const dayOfWeek = date.getDay();
  
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const replacements = {
      'yyyy': fullYear,
      'yy': year,
      'MMMM': months[date.getMonth()],
      'MMM': shortMonths[date.getMonth()],
      'MM': pad(month),
      'M': month,
      'dd': pad(day),
      'd': day,
      'HH': pad(hours),
      'H': hours,
      'hh': pad(hours % 12 || 12),
      'h': hours % 12 || 12,
      'mm': pad(minutes),
      'm': minutes,
      'ss': pad(seconds),
      's': seconds,
      'SSS': milliseconds.toString().padStart(3, '0'),
      'a': hours < 12 ? '上午' : '下午',
      'A': hours < 12 ? 'AM' : 'PM',
      'E': '星期' + weekdays[dayOfWeek],
      'e': '周' + weekdays[dayOfWeek],
      'D': Math.floor((date - new Date(fullYear, 0, 0)) / 86400000)
  };
  
  return format.replace(/(yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|SSS|a|A|E|e|D)/g, match => replacements[match]);
}
/**
 * 将字符串解析为日期对象
 * @param {string} dateString - 日期字符串
 * @param {string} [format] - 可选，指定日期字符串的格式
 * @returns {Date} 解析后的日期对象
 */
function parseDate(dateString, format="yyyy-MM-dd") {
  if (!dateString) return new Date(NaN);
  
  // 如果没有提供格式，尝试自动解析
  if (!format) {
      // 尝试ISO格式
      const isoDate = new Date(dateString);
      if (!isNaN(isoDate.getTime())) return isoDate;
      
      // 尝试常见格式
      const patterns = [
          // 年月日格式
          { regex: /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/, handler: ([, y, m, d]) => [y, m-1, d] },
          { regex: /^(\d{2})[-/](\d{1,2})[-/](\d{1,2})$/, handler: ([, y, m, d]) => [2000 + +y, m-1, d] },
          // 月日年格式（美国格式）
          { regex: /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/, handler: ([, m, d, y]) => [y, m-1, d] },
          { regex: /^(\d{1,2})[-/](\d{1,2})[-/](\d{2})$/, handler: ([, m, d, y]) => [2000 + +y, m-1, d] },
          // 带时间的格式
          { regex: /^(\d{4})[-/](\d{1,2})[-/](\d{1,2}) (\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/, 
            handler: ([, y, m, d, h, min, s]) => [y, m-1, d, h, min, s || 0] },
          // 中文格式
          { regex: /^(\d{4})年(\d{1,2})月(\d{1,2})日$/, handler: ([, y, m, d]) => [y, m-1, d] },
          { regex: /^(\d{4})年(\d{1,2})月(\d{1,2})日 (\d{1,2})时(\d{1,2})分(\d{1,2})秒$/, 
            handler: ([, y, m, d, h, min, s]) => [y, m-1, d, h, min, s] }
      ];
      
      for (const { regex, handler } of patterns) {
          const match = dateString.match(regex);
          if (match) {
              const [y, m, d, h = 0, min = 0, s = 0] = handler(match);
              return new Date(y, m, d, h, min, s);
          }
      }
      
      return new Date(NaN);
  }
  
  // 如果提供了格式，按照格式解析
  // 先替换dd,d防止对\d的重复替换
  const formatPattern = format
    .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    .replace(/\\d/g, '@@ESCAPED_DIGIT@@') // 先保护 \d（临时替换成特殊标记）
    .replace(/yyyy/g, '(\\d{4})')      // 4-digit year
    .replace(/yy/g, '(\\d{2})')        // 2-digit year
    .replace(/MMMM/g, '(\\w+)')        // Full month name
    .replace(/MMM/g, '(\\w{3})')      // Abbreviated month
    .replace(/MM/g, '(\\d{2})')        // 2-digit month (01-12)
    .replace(/M/g, '(\\d{1,2})')       // 1 or 2-digit month (1-12)
    .replace(/(?<!\\)dd/g, '(\\d{2})')        // 2-digit day (01-31) 
    .replace(/(?<!\\)d/g, '(\\d{1,2})')       // 1 or 2-digit day (1-31)
    .replace(/HH/g, '(\\d{2})')        // 24-hour, 2-digit (00-23)
    .replace(/H/g, '(\\d{1,2})')       // 24-hour, 1 or 2-digit (0-23)
    .replace(/hh/g, '(\\d{2})')        // 12-hour, 2-digit (01-12)
    .replace(/h/g, '(\\d{1,2})')       // 12-hour, 1 or 2-digit (1-12)
    .replace(/mm/g, '(\\d{2})')        // 2-digit minute (00-59)
    .replace(/m/g, '(\\d{1,2})')       // 1 or 2-digit minute (0-59)
    .replace(/ss/g, '(\\d{2})')        // 2-digit second (00-59)
    .replace(/s/g, '(\\d{1,2})')       // 1 or 2-digit second (0-59)
    .replace(/SSS/g, '(\\d{3})')       // 3-digit millisecond (000-999)
    .replace(/a/g, '(上午|下午)')     // AM/PM (中文)
    .replace(/A/g, '(AM|PM)')        // AM/PM (英文)
    .replace(/E/g, '(星期[日一二三四五六]')  // 星期X (中文)
    .replace(/e/g, '(周[日一二三四五六]')    // 周X (中文)
    .replace(/D/g, '(\\d{1,3}');      // Day of year (1-366)
  
  const regex = new RegExp(`^${formatPattern}$`);
  const match = dateString.match(regex);
  if (!match) return new Date(NaN);
  
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let year = 0, month = 0, day = 1, hour = 0, minute = 0, second = 0;
  let index = 1; // match[0]是整个匹配，从1开始是分组
  
  for (const token of format.match(/(yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|SSS|a|A|E|e|D)/g) || []) {
      const value = match[index++];
      if (!value) continue;
      
      switch (token) {
          case 'yyyy': year = parseInt(value, 10); break;
          case 'yy': year = 2000 + parseInt(value, 10); break;
          case 'MMMM': month = months.indexOf(value); break;
          case 'MMM': month = shortMonths.indexOf(value); break;
          case 'MM':
          case 'M': month = parseInt(value, 10) - 1; break;
          case 'dd':
          case 'd': day = parseInt(value, 10); break;
          case 'HH':
          case 'H': hour = parseInt(value, 10); break;
          case 'hh':
          case 'h': hour = parseInt(value, 10); break;
          case 'mm':
          case 'm': minute = parseInt(value, 10); break;
          case 'ss':
          case 's': second = parseInt(value, 10); break;
          case 'a': if (value === '下午') hour += 12; break;
          case 'A': if (value === 'PM') hour += 12; break;
      }
  }
  return new Date(year, month, day, hour, minute, second);
}

module.exports = {
  formatDate,
  parseDate
};