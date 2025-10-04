import React from "react";
import { LuArrowRight } from "react-icons/lu";
import moment from "moment";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const ExpenseTransactions = ({transactions, onSeeMore})=>{
    console.log("ExpenseTransactions data:", transactions); // Debug log
    
    return (
        <div className="card">
            <div className="flex items-center justify-between ">
                <h5 className="text-lg">Expanses</h5>

                <button className="card-btn" onClick={onSeeMore}>
                    SeeAll <LuArrowRight className="text-base" />
                </button>
        </div>

        <div className="mt-6">
            {transactions && transactions.length > 0 ? (
                transactions.slice(0,5).map((expense)=>(
                    <TransactionInfoCard
                    key={expense.id}
                    title={expense.category}
                    icon={expense.icon}
                    date={moment(expense.date).format("Do MMM YYYY")}
                    amount={expense.amount}
                    type="expense"
                    hideDeleteBtn
                    />
                ))
            ) : (
                <div className="text-center text-gray-500 py-4">
                    No expenses found for the last 30 days
                </div>
            )}
            </div>
        </div>
    )
};

export default ExpenseTransactions;