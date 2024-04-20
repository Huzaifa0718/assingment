"use client"

import { useState, useEffect } from "react";
import { FileDown, SquareX, Filter } from "lucide-react";

const Home = () => {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const generateRandomReports = () => {
    const randomReports = [];
    const names = [
      "John",
      "Jane",
      "Michael",
      "Emily",
      "William",
      "Sophia",
      "David",
      "Emma",
      "Daniel",
      "Olivia",
    ];
    for (let i = 1; i <= 30; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const fileName = `${randomName}-Report-${i}.csv`; // Generate random report name
      const fileContent = `Report ${i} content`; // You can generate random content here if needed
      const date = new Date().toLocaleDateString(); // Generate current date
      randomReports.push({ name: fileName, content: fileContent, date: date });
    }
    return randomReports;
  };

  const handleDownload = (fileName, fileContent) => {
    const blob = new Blob([fileContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const randomReports = generateRandomReports();
    setReports(randomReports);
    setFilteredReports(randomReports);
  }, []);

  const indexOfLastReport = currentPage * rowsPerPage;
  const indexOfFirstReport = indexOfLastReport - rowsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport,
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const changeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const handleFilter = () => {
    const filtered = reports.filter((report) => {
      return (
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.date.includes(searchTerm)
      );
    });
    setFilteredReports(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <div className="report-dialog">
      <div className="header">
        <h2>Recently Generated Reports</h2>
        <div className="buttons">
          <input type="text"
            placeholder="Search by name or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter style={{cursor: "pointer"}} onClick={handleFilter} />
          <SquareX style={{cursor: "pointer"}} onClick={() => setFilterOpen(!filterOpen)} />
        </div>
      </div>
      {filterOpen && (
        <div className="filter-container">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="date"
            placeholder="Search by date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleFilter}>Apply Filters</button>
        </div>
      )}
      <div className="report-table">
        <div className="table-header">
          <div>Date</div>
          <div>Reports</div>
          <div>Download</div>
        </div>
        <ul className="report-list">
          {currentReports.map((report, index) => (
            <li key={index} className="report-item">
              <div>{report.date}</div>
              <div>{report.name}</div>
              <div>
                <FileDown style={{cursor:"pointer"}}
                  onClick={() => handleDownload(report.name, report.content)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="pagination">
        <select value={rowsPerPage} onChange={changeRowsPerPage}>
          <option value={5}>5 rows per page</option>
          <option value={10}>10 rows per page</option>
          <option value={15}>15 rows per page</option>
          {/* Add more options as needed */}
        </select>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <button
          onClick={nextPage}
          disabled={indexOfLastReport >= filteredReports.length}
        >
          Next
        </button>
      </div>
      <style jsx>{`
        .report-dialog {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .buttons {
          display: flex;
          align-items: center;
        }

        .buttons input {
          margin-right: 10px;
          padding: 5px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        .buttons button {
          margin-right: 10px;
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: #fff;
          cursor: pointer;
        }

        .buttons button:hover {
          background-color: #0056b3;
        }

        .filter-container {
          margin-top: 20px;
          padding: 10px;
          background-color: #f0f0f0;
          border-radius: 5px;
        }

        .filter-container input {
          margin-right: 10px;
          padding: 5px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        .filter-container button {
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: #fff;
          cursor: pointer;
        }

        .filter-container button:hover {
          background-color: #0056b3;
        }

        .report-table {
          overflow-x: auto;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #007bff;
          color: #fff;
          font-weight: bold;
          padding: 10px;
          border-radius: 5px 5px 0 0;
        }

        .report-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .report-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #ddd;
          background-color: #f0f0f0; /* Changed background color to light gray */
        }

        .pagination {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .pagination select {
          margin-right: 10px;
          padding: 5px;
          border-radius: 5px;
        }

        .pagination button {
          margin: 0 5px;
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: #fff;
          cursor: pointer;
        }

        .pagination button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .pagination button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Home;