import React from 'react'
import { render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';
import AddMemberView from '../add-member-view'


describe('add member view', () => {
    describe('shoudl handle changes', () => {
        it('inputs changes', async () => {
            const { getByTestId } = render(<AddMemberView />)
            const name_input = getByTestId('member_name_input')
            const email_input = getByTestId('user_email_input')

            expect(name_input).toBeInTheDocument()
            expect(email_input).toBeInTheDocument()

            userEvent.type(name_input, "united");
            userEvent.type(email_input, "test@email.com");
         
            expect(screen.getByTestId("member_name_input")).toHaveValue("united");         
            expect(screen.getByTestId("user_email_input")).toHaveValue("test@email.com");
        })
    })


    describe('should add member', () => {
        it('', async () => {
            const addMemberFuction = jest.fn()
            const { getByTestId } = render(<AddMemberView setMember={addMemberFuction}/>);
            const name_input = getByTestId('member_name_input');
            const email_input = getByTestId('user_email_input');

            userEvent.type(name_input, "myName");
            userEvent.type(email_input, "test@email.com");
         
            const button = getByTestId('button');
            button.click();

            expect(addMemberFuction).toBeCalledWith({ member_name: 'myName', user_email: 'test@email.com' })
            
        })
    })
})