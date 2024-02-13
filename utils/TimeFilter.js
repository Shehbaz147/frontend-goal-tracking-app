export  function timeFilter(value) {
    if (!value) return '';
  
    const [hours, minutes, seconds] = value.split(':');
    const parsedHours = parseInt(hours, 10);
  
    if (parsedHours >= 12) {
      const amPmHours = parsedHours === 12 ? 12 : parsedHours - 12;
      return `${amPmHours}:${minutes} PM`;
    } else {
      return `${parsedHours}:${minutes} AM`;
    }
  }

  export function  formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  export function formatTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0'); // Convert to 12-hour format

    return `${formattedHours}:${minutes} ${ampm}`;
  }
  