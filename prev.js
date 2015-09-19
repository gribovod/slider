/*
 * ������� ��� ���������� ������ (<tr>),   
 * ���������� ���������� � �����
 * � ���� ������� (tbody)
 */

function appendFileInfo(tbody, data) {
    var tr = document.createElement('tr');
    for(var j = 0; j < data.length; j++) {
        td = document.createElement('td');
        td.innerHTML = data[j] || '����������';
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
    return tbody;
}

/*
 * ������� ��� �������� ������ �.�
 * ����������� ��� �������� 
 * �� �������� �������� �����������
 */

function makePreview(image, a) {
    var img = image,
        w = img.width, h = img.height,
        s = w / h;

    if(w > a && h > a) {
        if(img.width > img.height) {
            img.width = a;
            img.height = a / s;
        } else {
            img.height = a;
            img.width = a * s;
        }
    }

    return img;
}

/*
 * ��� ������� �� ����� �������� ��� ��������� (onchange)
 * input'� �.�. ����� ������������ ������� �����.
 */

function onFilesSelect(e) {
    // �������� ������ FileList
    var files = e.target.files,
    // div, ���� ������������ ������� � ����������� � ������
        output = document.getElementById('output'),
    // ������� � �����������
        table = document.createElement('table'),
    // � ����
        tbody = document.createElement('tbody'),
    // ������ � ������������ � ����� (���������������� ������ ��� �����)
        row,
    // FileReader (�������� ��� ������� �����)
        fr,
    // ������ file �� FileList'a
        file,
    // ������ � ����������� � �����
        data;

    // ������ ��������� � ��������
    output.innerHTML = '';

    // �������� � ������� � ����
    table.appendChild(tbody);
    // ���������� ��������� ������� (�������� �������)
    tbody.innerHTML =
        "<tr><td>���</td><td>MIME ���</td><td>������ (����)</td><td>������</td></tr>";

    // ���������� ��� ����� � FileList'�
    for(var i = 0; i < files.length; i++) {
        file = files[i];
        // ���� � ����� ���������� �����������
        if(/image.*/.test(file.type)) {
            // ����� ���������� � ��
            data = [file.name, file.type, file.size];
            fr = new FileReader();
            // ��������� ��� � ������ base64
            fr.readAsDataURL(file);
            // ��� ������ ���� ��������
            fr.onload = (function (file, data) {
                return function (e) {
                    var img = new Image(),
                        s, td;
                    img.src = e.target.result;

                    /*
                     * � ��� ������ ��������� �����������
                     * ��������� � ���������� � ����� html-��� ���������
                     */

                    if(img.complete) {
                        img = makePreview(img, 128);
                        data.push('<img src="' + img.src + '" width=' + img.width + '" height="' + img.height + '" />');
                        appendFileInfo(tbody, data);
                    } else {
                        img.onload =  function () {
                            img = makePreview(img, 128);
                            data.push('<img src="' + img.src + '" width=' + img.width + '" height="' + img.height + '" />');
                            appendFileInfo(tbody, data);
                        }
                    }

                }
            }) (file, data);
            // ���� ���� �� �����������
        } else {
            // �� ������ ������ ������� ��������������� �������
            data = [file.name, file.type, file.size, '���� �� �������� ������������'];
            appendFileInfo(tbody, data);
        }
    }
    // �������� ������� � ����������� � ����� � div
    output.appendChild(table);
}

// ��������� ������������ �� ������� file API
if(window.File && window.FileReader && window.FileList && window.Blob) {
    // ���� ��, �� ��� ������ �������� ����������
    onload = function () {
        // ������ ���������� �������, ������������� ��� ��������� input'�
        document.querySelector('input').addEventListener('change', onFilesSelect, false);
    }
// ���� ���, �� �������������, ��� ���� �������� �� �����
} else {
    alert('� ��������� ��� ������� �� ������������ file API');
}