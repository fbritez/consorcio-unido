import React from 'react'
import { render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event';
import MemberDetailsView from '../member-details-view';


const name = 'A';
const email = 'test@email.com';
const secondMail = 'otrotests@email.com';
const mynotes = 'some data'

const myInitialState = {
    member_name: name,
    user_email: email,
    secondary_email: secondMail,
    notes: mynotes
}

describe('member details view', () => {
    describe('should complete data', () => {
        it('from state', async () => {
            const { getByTestId } = render(<MemberDetailsView member={myInitialState}/>);

            const secondary_email = getByTestId('secondary_email');
            const notes = getByTestId('notes');

            expect(secondary_email).toHaveValue(secondMail);
            expect(notes).toBeInTheDocument(mynotes);
        })

        it('complete from inputs', async () => {
            const { getByTestId } = render(<MemberDetailsView member={{}}/>);

            const secondary_email = getByTestId('secondary_email');
            const notes = getByTestId('notes');

            await userEvent.type(secondary_email, "united");
            await userEvent.type(notes, "test@email.com");
     
            expect(screen.getByTestId("secondary_email")).toHaveValue("united");         
            expect(screen.getByTestId("notes")).toHaveValue("test@email.com");
        })
        
    })

    describe('should save data', () => {
        it('from state', async () => {
            const mockFunc = jest.fn();
            const { getByTestId } = render(<MemberDetailsView member={{}} handleMemberChange={mockFunc}/>);

            const secondary_email = getByTestId('secondary_email');
            const notes = getByTestId('notes');
            const button = getByTestId('add-item-button');

            await userEvent.type(secondary_email, "united");
            await userEvent.type(notes, "test@email.com");

            button.click()

            expect(mockFunc).toBeCalledWith({secondary_email: 'united', notes: "test@email.com"})
            
        })
    })
})