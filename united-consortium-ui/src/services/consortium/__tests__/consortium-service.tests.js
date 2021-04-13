import Consortium from "../../../model/consortium";
import ConsortiumService from "../consortium-service";
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const mockName = 'name'
const mockAddress = 'address'
const consortiumData =  { consortiums : [{name: mockName, address: mockAddress}]}

describe( 'consortium service tests', () => {
    const mock = new MockAdapter(axios);
    mock.onGet('http://localhost:5000/consortiums').reply(200, consortiumData);
    
    const service = new ConsortiumService();

    it('consortium service get all consortium', async () => {
        const result =  await service.getConsortiums();
        expect(result).toEqual([new Consortium(mockName, mockAddress)])
    })
})