import Consortium from "../../../model/consortium";
import ConsortiumService from "../consortium-service"

const mockName = 'name'
const mockAddress = 'address'

jest.mock(axios, () => ({
    get : jest.fn().mockRetrunValue({data: { consortiums : [{name: mockName, address : mockAddress }]}})
}))

describe( 'consortium service tests', () => {
    const service = new ConsortiumService()

    it('consortium service get all consortium', () => {
        const result = service.getConsortiums();
        

        expected(result).toEqual([new Consortium(mockName, mockAddress)])
    })
})