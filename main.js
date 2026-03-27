//Quản Lý Xác thực Tk
const auth = {
    logout: () => {
        localStorage.removeItem('todo_user'); // Chỉ xóa phiên làm việc, không xóa tài khoản
        window.location.href = 'index.html';
    },
    check: () => {
        const user = localStorage.getItem('todo_user');
        if (!user && !window.location.href.includes('index.html')) {
            window.location.href = 'index.html';
        }
    }
};

//QUẢN LÝ DỮ LIỆU (TASK/PROJECT)
const todo = {
    // Thêm mới với xử lý ảnh Base64
    add: () => {
        const name = document.getElementById('taskName').value;
        const file = document.getElementById('taskImg').files[0];
        const user = localStorage.getItem('todo_user');

        if (!name) return alert("Nhập tên đã!");

        const processSave = (imgBase64 = null) => {
            const storageKey = `data_${user}`;
            let list = JSON.parse(localStorage.getItem(storageKey)) || [];
            list.push({ id: Date.now(), name, img: imgBase64 });
            localStorage.setItem(storageKey, JSON.stringify(list));
            todo.render();
            document.getElementById('taskName').value = "";
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => processSave(e.target.result);
            reader.readAsDataURL(file);
        } else {
            processSave();
        }
    },

    // Hiển thị dữ liệu riêng của user
    render: () => {
        const user = localStorage.getItem('todo_user');
        const list = JSON.parse(localStorage.getItem(`data_${user}`)) || [];
        const container = document.getElementById('data-display');
        
        if (!container) return;

        container.innerHTML = list.map(item => `
            <div class="card">
                ${item.img ? `<img src="${item.img}">` : '<div style="height:150px; background:#eee; display:flex; align-items:center; justify-content:center">Không ảnh</div>'}
                <h4>${item.name}</h4>
                <button style="background:red" onclick="todo.delete(${item.id})">Xóa</button>
            </div>
        `).join('');
    },

    delete: (id) => {
        const user = localStorage.getItem('todo_user');
        let list = JSON.parse(localStorage.getItem(`data_${user}`));
        list = list.filter(item => item.id !== id);
        localStorage.setItem(`data_${user}`, JSON.stringify(list));
        todo.render();
    }
};
