// app.js - Logic for index.html (Dashboard)

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const projectGrid = document.getElementById('projectGrid');
    const createProjectModal = document.getElementById('createProjectModal');
    const openCreateProjectModalBtn = document.getElementById('openCreateProjectModal');
    const closeModalBtn = document.getElementById('closeModal');
    const createProjectForm = document.getElementById('createProjectForm');
    const searchInput = document.getElementById('searchProjects');

    // Initial render
    renderProjects();

    // Event Listeners
    if (openCreateProjectModalBtn) {
        openCreateProjectModalBtn.addEventListener('click', () => {
            createProjectModal.classList.add('active');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            createProjectModal.classList.remove('active');
        });
    }

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === createProjectModal) {
            createProjectModal.classList.remove('active');
        }
    });

    if (createProjectForm) {
        createProjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('projectName').value;
            const description = document.getElementById('projectDesc').value;
            const skillsStr = document.getElementById('projectSkills').value;
            
            const skills = skillsStr.split(',').map(s => s.trim()).filter(s => s);

            const newProject = {
                name,
                description,
                skills
            };

            Storage.saveProject(newProject);
            
            // Reset form and close modal
            createProjectForm.reset();
            createProjectModal.classList.remove('active');
            
            // Re-render
            renderProjects();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderProjects(e.target.value);
        });
    }

    // Functions
    function renderProjects(searchQuery = '') {
        if (!projectGrid) return;
        
        projectGrid.innerHTML = '';
        let projects = Storage.getProjects();

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            projects = projects.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query) ||
                p.skills.some(s => s.toLowerCase().includes(query))
            );
        }

        if (projects.length === 0) {
            projectGrid.innerHTML = '<p class="text-secondary" style="grid-column: 1 / -1; text-align: center;">No projects found.</p>';
            return;
        }

        projects.forEach(project => {
            const isMember = project.members && project.members.includes(Storage.getCurrentUser());
            const card = document.createElement('div');
            card.className = 'project-card glass-effect';
            
            const skillsHtml = (project.skills || []).map(skill => 
                `<span class="skill-tag">${skill}</span>`
            ).join('');

            const actionButton = isMember 
                ? `<a href="project.html?id=${project.id}" class="btn btn-secondary">Open Workspace</a>`
                : `<button class="btn btn-primary join-btn" data-id="${project.id}">Join Project</button>`;

            card.innerHTML = `
                <h3 class="project-title">${project.name}</h3>
                <p class="project-desc">${project.description}</p>
                <div class="project-skills">
                    ${skillsHtml}
                </div>
                <div class="project-footer">
                    <div class="member-count">
                        <ion-icon name="people"></ion-icon>
                        <span>${(project.members || []).length} Members</span>
                    </div>
                    ${actionButton}
                </div>
            `;

            projectGrid.appendChild(card);
        });

        // Add event listeners to join buttons
        document.querySelectorAll('.join-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectId = e.target.getAttribute('data-id');
                if (Storage.joinProject(projectId)) {
                    // Redirect to workspace
                    window.location.href = `project.html?id=${projectId}`;
                }
            });
        });
    }
});
