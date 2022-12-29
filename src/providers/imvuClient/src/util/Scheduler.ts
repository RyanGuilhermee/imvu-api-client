export class Scheduler {
  private setTime(): number {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const hoursEUA = new Date();
    let timeAlarm;

    if (hoursEUA.getHours() >= 5) {
      timeAlarm = new Date(year, month, day + 1, 5, 10, 0).getTime();
      // timeAlarm = new Date(year, month, day, hours, minutes + 3, 0).getTime();
      console.log("depois das 2h");
    } else {
      timeAlarm = new Date(year, month, day, 5, 10, 0).getTime();
      console.log("antes das 2h");
    }

    //timeAlarm = new Date(year, month, day, hours, minutes + 2, 0).getTime();

    const currentTime = new Date().getTime();
    const timeDiff = timeAlarm - currentTime;

    const dateDiff = new Date(timeDiff);
    const hoursDiff = dateDiff.getHours();
    const minutesDiff = dateDiff.getMinutes();
    const secondsDiff = dateDiff.getSeconds();

    console.log(`${day}/${month + 1}/${year} - ${hours}:${minutes}:${seconds}`);
    console.log(`${hoursDiff}:${minutesDiff}:${secondsDiff}`);

    return timeDiff;
  }

  public execute(callback: Function): void {
    const time = this.setTime();

    setTimeout(async () => {
      await callback();

      this.execute(callback);
    }, time);
  }
}
