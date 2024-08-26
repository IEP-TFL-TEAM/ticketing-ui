import * as XLSX from 'xlsx';

const xls = (rows, worksheetName, file) => {
	const worksheet = XLSX.utils.json_to_sheet(rows);
	const workbook = XLSX.utils.book_new();

	XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
	XLSX.writeFile(workbook, file, { compression: true });
};

const multipleXls = (worksheets, file) => {
	const workbook = XLSX.utils.book_new();

	worksheets.forEach(({ rows, worksheetName }) => {
		const worksheet = XLSX.utils.json_to_sheet(rows);
		XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
	});

	XLSX.writeFile(workbook, file, { compression: true });
};

export { xls, multipleXls };
