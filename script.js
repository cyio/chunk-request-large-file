const url = 'https://images.pexels.com/photos/5965592/pexels-photo-5965592.jpeg?auto=compress&cs=tinysrgb'; //需要请求的文件url
const type = "application/octet-stream" // 根据实际文件类型修改mime类型
const saveFilename = 'largefile.jpeg'

document.getElementById('btn-download').addEventListener('click', () => {
    const chunkSize = 1024 * 1024; // 分块大小1MB
  
    // 先请求文件大小
    fetch(url, { method: 'HEAD' }).then(response => {
        const totalSize = response.headers.get('Content-Length'); // 获得文件大小
    
        if (totalSize > 0) {
            const chunkCounts = Math.ceil(totalSize / chunkSize);
    
            let chunkFetches = Array.from({length: chunkCounts}).map((_, index) => {
                const start = index * chunkSize;
                const end = (start + chunkSize < totalSize) ? (start + chunkSize) : totalSize;
        
                return fetch(url, {
                    headers: {
                        'Range': `bytes=${start}-${end}`
                    }
                }).then(response => response.blob());
            });
    
            Promise.all(chunkFetches)
                .then(blobs => {
                    let file = new Blob(blobs, {type});
                    let url = URL.createObjectURL(file);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = saveFilename;
                    a.click();
                    a.remove();
                })
                .catch(error => {
                    console.error("Error occurred while downloading file:", error);
                });
        } else {
            console.error("Could not determine file size.");
        }
    });
});