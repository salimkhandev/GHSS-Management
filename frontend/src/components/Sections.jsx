function SectionList({ sections, setStudents }) {
    const handleSectionClick = (sectionId) => {
        fetch(`/api/students/${sectionId}`)
            .then(response => response.json())
            .then(data => setStudents(data));
    };

    return (
        <div>
            <h2>Sections</h2>
            {sections.map(s => (
                <div key={s.id} onClick={() => handleSectionClick(s.id)}>
                    {s.name}
                </div>
            ))}
        </div>
    );
}

export default SectionList;
