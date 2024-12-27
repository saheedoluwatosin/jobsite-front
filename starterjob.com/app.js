async function fetchJobs() {
    try {
        const response = await fetch('https://starterjob.onrender.com/v1/api/alljobs');
        const data = await response.json();
        if (data.success) {
            const jobs = data.alljobs;
            jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const jobList = document.getElementById('job-list');

            // Clear the job list before rendering new jobs
            jobList.innerHTML = '';

            // Render job cards
            jobs.forEach(job => {
                const jobCard = document.createElement('div');
                jobCard.className = 'job-card';
                jobCard.innerHTML = `
                    <h3>${job.title}</h3>
                    <p>Company: ${job.company}</p>
                    <p>Location: ${job.location}</p>
                    <button class="view-details" data-id="${job._id}">View Details</button>
                `;
                jobList.appendChild(jobCard);
            });

            // Attach event listeners to "View Details" buttons
            document.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const jobId = event.target.getAttribute('data-id');
                    await fetchJobDetails(jobId);
                });
            });
        } else {
            console.error('Failed to fetch jobs');
        }
    } catch (error) {
        console.error('Error fetching jobs:', error.message || error);
    }
}

async function fetchJobDetails(jobId) {
    try {
        const response = await fetch(`https://starterjob.onrender.com/v1/api/get/${jobId}`);
        const data = await response.json();
        if (data.success) {
            const job = data.job;
            const jobDetailsSection = document.getElementById('job-details');

            // Populate job details
            document.getElementById('job-title').textContent = job.title;
            document.getElementById('company-name').textContent = `Company: ${job.company}`;
            document.getElementById('location').textContent = `Location: ${job.location}`;
            document.getElementById('job-description').innerHTML = `<pre>${job.description}</pre>`;
            document.getElementById('job-type').textContent = `Job Type: ${job.jobType}`;

            // Create and append the Apply Now button
            if (job.joblink) {
                const applyButton = document.createElement('button');
                applyButton.className = 'apply-button';
                applyButton.innerHTML = `<a href="${job.joblink}" target="_blank">Apply Now</a>`;

                // Append Apply button before the Back to Job List button
                jobDetailsSection.appendChild(applyButton);
            }

            // Find the Back to Job List button
            const backButton = document.getElementById('back-to-list');

            // Show job details and hide job list
            document.getElementById('job-list').style.display = 'none';
            jobDetailsSection.style.display = 'block';
            backButton.style.display = 'block';

            // Add event listener to "Back to Job List" button
            backButton.addEventListener('click', () => {
                jobDetailsSection.style.display = 'none';
                document.getElementById('job-list').style.display = 'block';
                backButton.style.display = 'none';
            });
        } else {
            console.error('Failed to fetch job details');
        }
    } catch (error) {
        console.error('Error fetching job details:', error);
    }
}




// Fetch jobs when the page loads
fetchJobs();
