import { roundNumber } from './utils';

class ExpensesReceipt {

    constructor(consortium_id, items, month, year, isOpen, identifier, members_receipts) {
        this.consortium_id = consortium_id;
        this.expense_items = items;
        this.month = month;
        this.year = year;
        this.is_open = isOpen;
        this.identifier = identifier;
        this.member_expenses_receipt_details = members_receipts;
    }

    getTotalAmount() {
        return roundNumber(this.expense_items.reduce((a, b) => a + b.amount, 0));
    }

    getCurrencyAndTotalAmount() {
        return `$${this.getTotalAmount()}`;
    }

    isOpen() {
        return this.is_open;
    }

    close() {
        this.is_open = false;
    }

    updateMemberReceipt(memberReceipt) {
        const idx = this.member_expenses_receipt_details.findIndex(member => member.member.member_name == memberReceipt.member.member_name)
        this.member_expenses_receipt_details[idx] = memberReceipt
    }

}

export default ExpensesReceipt;