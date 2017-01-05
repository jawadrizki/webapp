/**
 * Created by jawad on 01/02/2017.
 */
class Message{
    constructor(from,to,message,type){
        this._id = "";
        this._from = from;
        this._to = to;
        this._message = message;
        this._type = type
        this._DB = firebase.database().ref();
    }
    get type(){return this._type}
    set type(type) {this._type = type}
    get from() {return this._from}
    get to() {return this._to}
    get message() {return this._message}
    set from(from){
        this._from = from;
    }
    get id() { return this._id }
    set id(id) { this._id = id}
    set to(to) {
        this._to = to
    }
    set message(message) {
        this._message = message
    }
    send(){
        this._DB.push({
                message: {
                    from: this._from,
                    to: this._to,
                    message: this._message,
                    type: this._type
                }
            }
        )
    }
}