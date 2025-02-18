const getShortlistedCandidates = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findById(jobId)
            .populate('shortlistedCandidates')
            .select('shortlistedCandidates');
            
        res.status(200).json({
            success: true,
            candidates: job.shortlistedCandidates
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}; 