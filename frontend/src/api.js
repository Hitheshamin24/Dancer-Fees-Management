const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function fetchStudents(sort) {
  const url = sort ? `${API_URL}/api/students?sort=${encodeURIComponent(sort)}` : `${API_URL}/api/students`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch students');
  return res.json();
}

export async function addStudent(name) {
  const res = await fetch(`${API_URL}/api/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('Failed to add student');
  return res.json();
}

export async function updateStudent(id, data) {
  const res = await fetch(`${API_URL}/api/students/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update student');
  return res.json();
}

export async function deleteStudent(id) {
  const res = await fetch(`${API_URL}/api/students/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete student');
  return res.json();
}

export async function fetchPayments() {
  const res = await fetch(`${API_URL}/api/payments`);
  if (!res.ok) throw new Error('Failed to fetch payments');
  return res.json();
}
