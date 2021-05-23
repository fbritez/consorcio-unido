
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

}

export default Consortium