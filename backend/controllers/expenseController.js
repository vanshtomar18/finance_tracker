//const User = require('../models/User');
const xlsx = require("xlsx");
const Expense = require("../models/Expense");

//Add expense source
exports.addExpense = async(req,res)=>{
    const userId=req.user.id;

    try{
        const {icon,category,amount,date}=req.body;
        //validation :check for missing fields
        if(!category || !amount || !date){
            return res.status(400).json({message:"All fields are required"});
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        const newExpense = await Expense.create({
            user_id: userId,
            icon,
            category,
            amount,
            date: parsedDate,
        });
        
        res.status(201).json(newExpense);
    }catch(error){
        res.status(500).json({message:"Internal server error",error: error.message});
    }
};

//get all Expense source
exports.getAllExpense = async(req,res)=>{
    const userId=req.user.id;
    try{
        const expense = await Expense.findByUserId(userId);
        res.json(expense);
    }catch(error){
        res.status(500).json({message:"Internal server error",error: error.message});
    }
};

//delete Expense source
exports.deleteExpense = async(req,res)=>{
    const userId = req.user.id;
   
    try{
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({message:"Expense not found"});
        }
        
        // Check if the expense belongs to the current user
        if (expense.user_id !== userId) {
            return res.status(403).json({message:"Access denied. You can only delete your own expense records."});
        }
        
        await expense.delete();
        res.status(200).json({message:"Expense source deleted successfully"});
    }catch(error){
        console.error("Delete expense error:", error);
        res.status(500).json({message:"Internal server error",error: error.message});
    }
};

//download income source in excel format
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.findByUserId(userId);

        // Convert Expense data to Excel format
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: new Date(item.date).toISOString().split("T")[0], // Format date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense Data");

        const filePath = "expense_details.xlsx";
        xlsx.writeFile(wb, filePath);

        res.download(filePath, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).json({ message: "Failed to download file." });
            }
        });
    } catch (error) {
        console.error("Error downloading expense details:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};