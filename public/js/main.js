$(function(){

  function updateView(data) {
    $('#rows').html(
      data.map(d =>
        `<tr>
          <td>${d.name}</td>
          <td>${d.value}</td>
          <td><button class="btn btn-xs btn-danger delete" data-id="${d._id}">Delete</button></td>
        </tr>`
      ).join('')
    );
  }

  function getData(params) {
    $('.name').val('');
    $('.value').val('');

    $.get( '/api', params, function(resp) {
      $('#status').text(resp.message);
      console.table(resp.data);
      updateView(resp.data);
    });
  }

  getData({ type: 'get' });

  $('#form').on('click', 'button', function(e){
    getData({
      type: $(this).data('action'),
      name: $(this).parents('fieldset').find('.name').val() || 'name',
      value: $(this).parents('fieldset').find('.value').val() || 'value-' + new Date().toISOString(),
    });
    e.preventDefault();
  });

  $('#rows').on('click', '.delete', function(e) {
    getData({
      type: 'delete-one',
      id: $(this).data('id')
    });
    e.preventDefault();
  });
});
