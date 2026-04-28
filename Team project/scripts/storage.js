// Utility to manage LocalStorage

const STORAGE_KEYS = {
    PROJECTS: 'studentcollab_projects',
    TASKS: 'studentcollab_tasks',
    CHATS: 'studentcollab_chats',
    CURRENT_USER: 'studentcollab_user'
};

// Initialize default user if none exists
if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    const randomNum = Math.floor(Math.random() * 1000);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, `Student_${randomNum}`);
}

const Storage = {
    getCurrentUser() {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    },

    // --- Projects ---
    getProjects() {
        const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        return data ? JSON.parse(data) : [];
    },

    getProjectById(id) {
        return this.getProjects().find(p => p.id === id);
    },

    saveProject(project) {
        const projects = this.getProjects();
        project.id = project.id || Date.now().toString();
        project.members = project.members || [this.getCurrentUser()]; // Creator is first member
        
        const existingIndex = projects.findIndex(p => p.id === project.id);
        if (existingIndex >= 0) {
            projects[existingIndex] = project;
        } else {
            projects.push(project);
        }
        
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        return project;
    },

    joinProject(projectId) {
        const project = this.getProjectById(projectId);
        const user = this.getCurrentUser();
        
        if (project && !project.members.includes(user)) {
            project.members.push(user);
            this.saveProject(project);
            return true;
        }
        return false;
    },

    // --- Tasks ---
    getTasks(projectId) {
        const data = localStorage.getItem(STORAGE_KEYS.TASKS);
        const allTasks = data ? JSON.parse(data) : [];
        return allTasks.filter(t => t.projectId === projectId);
    },

    saveTask(task) {
        const data = localStorage.getItem(STORAGE_KEYS.TASKS);
        const allTasks = data ? JSON.parse(data) : [];
        
        task.id = task.id || Date.now().toString();
        
        const existingIndex = allTasks.findIndex(t => t.id === task.id);
        if (existingIndex >= 0) {
            allTasks[existingIndex] = task;
        } else {
            allTasks.push(task);
        }
        
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(allTasks));
        return task;
    },

    updateTaskStatus(taskId, newStatus) {
        const data = localStorage.getItem(STORAGE_KEYS.TASKS);
        const allTasks = data ? JSON.parse(data) : [];
        
        const task = allTasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(allTasks));
        }
    },

    // --- Chats ---
    getChats(projectId) {
        const data = localStorage.getItem(STORAGE_KEYS.CHATS);
        const allChats = data ? JSON.parse(data) : [];
        return allChats.filter(c => c.projectId === projectId);
    },

    saveChat(chat) {
        const data = localStorage.getItem(STORAGE_KEYS.CHATS);
        const allChats = data ? JSON.parse(data) : [];
        
        chat.id = chat.id || Date.now().toString();
        chat.timestamp = chat.timestamp || new Date().toISOString();
        
        allChats.push(chat);
        localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(allChats));
        return chat;
    }
};

// Add some mock data if empty
if (Storage.getProjects().length === 0) {
    Storage.saveProject({
        name: "AI Study Buddy",
        description: "Building an LLM powered study assistant for CS students. Need help with the frontend.",
        skills: ["React", "Python", "OpenAI"],
        members: ["Student_123"]
    });
    Storage.saveProject({
        name: "Campus Market",
        description: "A marketplace app for students to buy/sell textbooks and dorm stuff safely.",
        skills: ["Flutter", "Firebase", "UI/UX"],
        members: ["Student_456", "Student_789"]
    });
}
