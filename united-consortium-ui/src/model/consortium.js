
class Consortium{

    constructor(name, address, identifier, members, administrators){
        this.name = name;
        this.address = address;
        this.id = identifier;
        this.members = members;
        this.administrators = administrators;
    }

    setMembers(members){
        this.members = members;
    }

    addAdministrator(administrator_email){
        this.administrators.push(administrator_email);
    }

    isAdministrator(user){
        return this.administrators.includes(user.email);
    }

}

export default Consortium