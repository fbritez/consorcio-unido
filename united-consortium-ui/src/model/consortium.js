
class Consortium{

    constructor(name, address, identifier, members, administrators){
        this.name = name;
        this.address = address;
        this.id = identifier;
        this.members = members;
        this.administrators = administrators;
        this.disabled = false;
    }

    setMembers(members){
        this.members = members;
    }

    addAdministrator(administrator_email){
        if(!this.isAdministrator({user : administrator_email})){
            this.administrators.push(administrator_email);
        }
    }

    isAdministrator(user){
        return this.administrators.includes(user.email);
    }

    setAsDisabled(){
        this.disabled = true;
    }

}

export default Consortium