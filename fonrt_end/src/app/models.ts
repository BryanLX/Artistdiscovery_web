export class EventJoinForm {
    public firstName: string; //
    public lastName: string; //
    public email: string; //
    public phoneNumber: string;
    public socailMedia: string; //
    public haveVehicle: boolean;
    public peopleAttend: number;
    public seatsAvailable: number;
    public note: string;
}

export class Event {
    public name: string;
    public _id: string;
    public briefdescription: string;
    public date: string;
    public image: string;
    public departLat: number;
    public departLng: number;
    public destLat: number;
    public destLng: number;
    public description: string[];
}

export class EventInfoForm {
    public name: string;
    public eventid: string;
    public username: string;
    public ifVehicle: boolean;
    public peopleAttend: number;
    public seatsAvailable: number;
    public note: string;
}




export class MemberForm {
    public username:string;
    public permission:number;
    public firstName:string;
    public lastName:string;
    public email:string;
    public phone:number;
    public socailMedia:string;
    public activationToken:string;
    public activated:boolean;
    public passwordInitialized:boolean;
}

export class LogInForm {
    public username:string;
    public password:string;
}
