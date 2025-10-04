const User = require("../models/User");
const xlsx = require("xlsx");
const Income = require("../models/Income");

//Add income source
exports.addIncome = async(req,res)=>{
    const userId=req.user.id;

    try{
        const {icon,source,amount,date}=req.body;
        //validation :check for missing fields
        if(!source || !amount || !date){
            return res.status(400).json({message:"All fields are required"});
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        const newIncome = await Income.create({
            user_id: userId,
            icon,
            category: source, // Map source to category
            amount,
            date: parsedDate,
        });
        
        res.status(201).json({message:"Income source added successfully",newIncome});
    }catch(error){
        res.status(500).json({message:"Internal server error",error: error.message});
    }
};

//get all income source
exports.getAllIncome = async(req,res)=>{
    const userId=req.user.id;
    try{
        const income = await Income.findByUserId(userId);
        res.status(200).json({message:"Income source fetched successfully", income});
    }catch(error){
        res.status(500).json({message:"Internal server error",error: error.message});
    }
};

//delete income source
exports.deleteIncome = async(req,res)=>{
    const userId = req.user.id;
   
    try{
        const income = await Income.findById(req.params.id);
        if (!income) {
            return res.status(404).json({message:"Income not found"});
        }
        
        // Check if the income belongs to the current user
        if (income.user_id !== userId) {
            return res.status(403).json({message:"Access denied. You can only delete your own income records."});
        }
        
        await income.delete();
        res.status(200).json({message:"Income source deleted successfully"});
    }catch(error){
        console.error("Delete income error:", error);
        res.status(500).json({message:"Internal server error",error: error.message});
    }
};

//download income source in excel format
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.findByUserId(userId);

        // Convert Income data to Excel format
        const data = income.map((item) => ({
            Source: item.category, // Map category back to source for Excel
            Amount: item.amount,
            Date: new Date(item.date).toISOString().split("T")[0], // Format date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income Data");

        const filePath = "income_details.xlsx";
        xlsx.writeFile(wb, filePath);

        res.download(filePath, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).json({ message: "Failed to download file." });
            }
        });
    } catch (error) {
        console.error("Error downloading income details:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};