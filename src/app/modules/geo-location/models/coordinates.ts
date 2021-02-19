export class Coordinates {
    public latitude: number;
    public longitude: number;
    public address: string;


    constructor(v?: { latitude: number, longitude: number, address: string }) {
        if (v) {
            this.latitude = v.latitude;
            this.longitude = v.longitude;
            this.address = v.address || ' where I am ';
        }
    }

    public clone(address) {
        // tslint:disable: semicolon
        if (address) {
            this.address = address.address
            this.latitude = address.latitude
            this.longitude = address.longitude
        }
        return this
    }

    public getLatitude() {
        return this.latitude;
    }
    public getLongitude() {
        return this.longitude;
    }

    serialize() {
        return { address: this.address||'', latitude: this.latitude || 0, longitude: this.longitude || 0 }
    }
    setLatitude(latitude: string | number) {
        this.latitude = Number(latitude);
    }

    setLongitude(longitude: string | number) {
        this.longitude = Number(longitude);
    }
    getAddress(): string {
        return this.address;
    }
}
