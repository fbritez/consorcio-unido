import Consortium from "../../../model/consortium";
import consortiumService from "../consortium-service";
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const mockName = 'name'
const mockAddress = 'address'
const consortiumData =  { consortiums : [{name: mockName, address: mockAddress}]}

describe( 'consortium service tests', () => {
    const mock = new MockAdapter(axios);
    mock.onGet('http://localhost:5000/consortiums?user_identifier=mail.com').reply(200, consortiumData);

    it('consortium service get all consortium', async () => {
        const result =  await consortiumService.getConsortiums({email:'mail.com'});
        expect(result).toEqual([new Consortium(mockName, mockAddress)])
    })
})