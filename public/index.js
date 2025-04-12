document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://localhost:8000/api';
    const ALUNOS_API = `${API_BASE_URL}/alunos`;
    const MATRICULAS_API = `${API_BASE_URL}/matriculas`;

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const alunoForm = document.getElementById('alunoForm');
    const alunosList = document.getElementById('alunosList');
    const searchAlunoInput = document.getElementById('searchAlunoInput');
    const searchAlunoBtn = document.getElementById('searchAlunoBtn');

    const matriculaForm = document.getElementById('matriculaForm');
    const matriculasList = document.getElementById('matriculasList');
    const alunoSelect = document.getElementById('aluno_id');
    const searchMatriculaInput = document.getElementById('searchMatriculaInput');
    const searchMatriculaBtn = document.getElementById('searchMatriculaBtn');

    document.getElementById('cancelAlunoBtn').addEventListener('click', resetAlunoForm);
    document.getElementById('cancelMatriculaBtn').addEventListener('click', resetMatriculaForm);

    Inputmask({
        mask: '(99) 99999-9999',
        placeholder: '(00) 00000-0000',
    }).mask(document.getElementById('telefone'));

    Inputmask({
        mask: '99999-999',
        placeholder: '00000-000',
    }).mask(document.getElementById('endereco_cep'));

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    fetchAlunos();
    fetchMatriculas();
    loadAlunosForDropdown();

    async function fetchAlunos() {
        try {
            const response = await fetch(ALUNOS_API);
            const alunos = await response.json();
            displayAlunos(alunos);
        } catch (error) {
            alunosList.innerHTML = '<p class="error">Erro ao carregar alunos.</p>';
        }
    }

    function displayAlunos(response) {
        const alunos = response.data || [];

        if (!alunos || alunos.length === 0) {
            alunosList.innerHTML = '<p>Nenhum aluno cadastrado.</p>';
            return;
        }

        alunosList.innerHTML = alunos.map(aluno => `
        <div class="card" data-id="${aluno.ID}">
          <h3>${aluno.Nome}</h3>
          <p><strong>Nascimento:</strong> ${aluno.Nascimento}</p>
          <p><strong>Telefone:</strong> ${aluno.Telefone}</p>
          <p><strong>CEP:</strong> ${aluno.CEP}</p>
          ${aluno.Matrícula && typeof aluno.Matrícula === 'object' ? `
            <div class="matricula-info">
                <p><strong>Plano:</strong> ${aluno.Matrícula['Plano (Dias)']} dias</p>
                <p><strong>Status:</strong> ${aluno.Matrícula.Status}</p>
                <p><strong>Matrícula:</strong> ${aluno.Matrícula.Matrícula}</p>
                <p><strong>Vencimento:</strong> ${aluno.Matrícula.Vencimento}</p>
            </div>
          ` : '<p class="matricula-info">Não há matrícula associada.</p>'}
          <div class="card-actions">
            <button class="primary edit-aluno" data-id="${aluno.ID}">Editar</button>
            <button class="danger delete-aluno" data-id="${aluno.ID}">Deletar</button>
          </div>
        </div>
        `).join('');
    }

    alunoForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const alunoData = {
            nome: document.getElementById('nome').value,
            data_de_nascimento: formatDateForInput(document.getElementById('data_de_nascimento').value),
            telefone: document.getElementById('telefone').value,
            endereco_cep: document.getElementById('endereco_cep').value
        };

        const alunoId = document.getElementById('alunoId').value;

        try {
            if (alunoId) {
                await fetch(`${ALUNOS_API}/${alunoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(alunoData)
                });
            } else {
                await fetch(ALUNOS_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(alunoData)
                });
            }

            resetAlunoForm();
            fetchAlunos();
        } catch (error) {
            alert('Erro ao salvar aluno.');
        }
    });

    function resetAlunoForm() {
        alunoForm.reset();
        document.getElementById('alunoId').value = '';
    }

    searchAlunoBtn.addEventListener('click', async () => {
        const searchTerm = searchAlunoInput.value.trim();
        if (!searchTerm) {
            fetchAlunos();
            return;
        }

        try {
            const response = await fetch(`${ALUNOS_API}/${searchTerm}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            const alunos = result.data ? [result.data] : [result];

            displayAlunos({ data: alunos });

        } catch (error) {
            console.error('Search error:', error);
            alunosList.innerHTML = `
            <div class="error-card">
                <h3>Aluno não encontrado</h3>
            </div>
        `;
        }
    });

    async function fetchMatriculas() {
        try {
            const response = await fetch(MATRICULAS_API);
            const matriculas = await response.json();
            displayMatriculas(matriculas);
        } catch (error) {
            matriculasList.innerHTML = '<p class="error">Nenhuma matrícula cadastrada.</p>';
        }
    }

    function displayMatriculas(response) {
        const matriculas = response.data || [];

        if (!matriculas || matriculas.length === 0) {
            matriculasList.innerHTML = '<p>Nenhuma matrícula cadastrada.</p>';
            return;
        }

        matriculasList.innerHTML = matriculas.map(matricula => `
        <div class="card" data-id="${matricula["ID Da Matrícula"]}">
          <h3>ID Aluno: ${matricula.Aluno.ID} - Nome: ${matricula.Aluno.Nome || 'N/A'}</h3>
          <p><strong>Plano:</strong> ${matricula["Plano (Dias)"]} dias</p>
          <p><strong>Status:</strong> ${matricula.Status}</p>
          <p><strong>Matrícula:</strong> ${matricula.Matrícula}</p>
          <p><strong>Vencimento:</strong> ${matricula.Vencimento}</p>
          <div class="card-actions">
            <button class="primary edit-matricula" data-id="${matricula["ID Da Matrícula"]}">Editar</button>
            <button class="danger delete-matricula" data-id="${matricula["ID Da Matrícula"]}">Deletar</button>
          </div>
        </div>
        `).join('');
    }

    async function loadAlunosForDropdown() {
        try {
            const response = await fetch(ALUNOS_API);
            const { data: alunos } = await response.json();

            alunoSelect.innerHTML = alunos.map(aluno =>
                `<option value="${aluno.ID}">${aluno.Nome}</option>`
            ).join('');

            alunoSelect.innerHTML = `<option value="">Selecione um aluno</option>` + alunoSelect.innerHTML;
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
            alunoSelect.innerHTML = `<option value="">Erro ao carregar alunos</option>`;
        }
    }

    matriculaForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const matriculaData = {
            aluno_id: parseInt(document.getElementById('aluno_id').value),
            tipo_do_plano: parseInt(document.getElementById('tipo_do_plano').value)
        };

        const matriculaId = document.getElementById('matriculaId').value;

        try {
            if (matriculaId) {
                await fetch(`${MATRICULAS_API}/${matriculaId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(matriculaData)
                });
            } else {
                await fetch(MATRICULAS_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(matriculaData)
                });
            }

            resetMatriculaForm();
            fetchMatriculas();
            fetchAlunos();

        } catch (error) {
            alert(error.message || 'Erro ao salvar matrícula.');
        }
    });

    function resetMatriculaForm() {
        matriculaForm.reset();
        document.getElementById('matriculaId').value = '';
    }

    searchMatriculaBtn.addEventListener('click', async () => {
        const searchTerm = searchMatriculaInput.value.trim();
        if (!searchTerm) {
            fetchMatriculas();
            return;
        }

        try {
            const response = await fetch(`${MATRICULAS_API}/${searchTerm}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            const matriculas = result.data ? [result.data] : [result];

            displayMatriculas({ data: matriculas });

        } catch (error) {
            console.error('Matrícula search error:', error);
            matriculasList.innerHTML = `
                <div class="error-card">
                    <h3>Matrícula não encontrada</h3>
                </div>
            `;
        }
    });

    document.addEventListener('click', async function (e) {
        if (e.target.classList.contains('delete-aluno')) {
            const id = e.target.getAttribute('data-id');
            if (confirm('Tem certeza que deseja deletar este aluno?')) {
                try {
                    await fetch(`${ALUNOS_API}/${id}`, { method: 'DELETE' });
                    fetchAlunos();
                } catch (error) {
                }
            }
        }

        if (e.target.classList.contains('edit-aluno')) {
            const id = e.target.getAttribute('data-id');
            try {
                const response = await fetch(`${ALUNOS_API}/${id}`);
                const aluno = await response.json();

                document.getElementById('alunoId').value = aluno.ID;
                document.getElementById('nome').value = aluno.Nome;
                document.getElementById('data_de_nascimento').value = formatDateForInput(aluno.Nascimento);;
                document.getElementById('telefone').value = aluno.Telefone;
                document.getElementById('endereco_cep').value = aluno.CEP;

                const alunoFormSection = document.querySelector('#alunos .form-section');
                alunoFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

                document.querySelector('#alunos .form-section h2').textContent = 'Editando Aluno';

                document.getElementById('nome').focus();

            } catch (error) {
                alert('Erro ao carregar aluno.');
            }
        }

        if (e.target.classList.contains('add-matricula')) {
            const alunoId = e.target.getAttribute('data-id');
            document.getElementById('aluno_id').value = alunoId;
            document.querySelector('[data-tab="matriculas"]').click();
        }

        if (e.target.classList.contains('delete-matricula')) {
            const id = e.target.getAttribute('data-id');
            if (confirm('Tem certeza que deseja deletar esta matrícula?')) {
                try {
                    await fetch(`${MATRICULAS_API}/${id}`, { method: 'DELETE' });
                    fetchMatriculas();
                    fetchAlunos();
                } catch (error) {
                }
            }
        }

        if (e.target.classList.contains('edit-matricula')) {
            const id = e.target.getAttribute('data-id');
            try {
                const response = await fetch(`${MATRICULAS_API}/${id}`);
                if (!response.ok) throw new Error('Failed to fetch matrícula');

                const result = await response.json();
                const matricula = result.data;

                if (!matricula) throw new Error('Matrícula not found');

                document.getElementById('matriculaId').value = matricula['ID Da Matrícula'];
                document.getElementById('aluno_id').value = matricula.Aluno.ID;
                document.getElementById('tipo_do_plano').value = matricula['Plano (Dias)'];

                document.querySelector('[data-tab="matriculas"]').click();
            } catch (error) {
                console.error('Error loading matrícula:', error);
                alert('Erro ao carregar matrícula: ' + error.message);
            }
        }
    });

    function formatDateForInput(dateString) {
        if (dateString.includes('-')) {
            const [year, month, day] = dateString.split('-');
            return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year.padStart(4, '0')}`;
        }
        else if (dateString.includes('/')) {
            const [day, month, year] = dateString.split('/');
            return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year.padStart(4, '0')}`;
        }
    }

    function resetAlunoForm() {
        alunoForm.reset();

        document.getElementById('alunoId').value = '';

        document.querySelector('#alunos .form-section h2').textContent = 'Adicionar/Editar Aluno';

        const errorMessages = document.querySelectorAll('#alunos .error-message');
        errorMessages.forEach(msg => msg.remove());

        document.getElementById('nome').focus();
    }

    function resetMatriculaForm() {
        matriculaForm.reset();

        document.getElementById('matriculaId').value = '';

        document.querySelector('#matriculas .form-section h2').textContent = 'Adicionar/Editar Matrícula';

        const errorMessages = document.querySelectorAll('#matriculas .error-message');
        errorMessages.forEach(msg => msg.remove());

        document.getElementById('aluno_id').focus();
    }

});