// You can run this in MongoDB Compass or your database tool
db.jobs.insertOne({
    jobTitle: "Full Stack Developer",
    employmentType: "Full Time",
    location: "Remote",
    salary: "$80,000 - $120,000",
    description: "We are looking for a Full Stack Developer...",
    status: "active",
    employerId: ObjectId("your_employer_id"), // Replace with actual employer ID
    createdAt: new Date(),
    updatedAt: new Date()
}); 