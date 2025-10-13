$(function () { 
    
    // Handle getting staff
    $(document).on('click', '.ajaxGetStaff', function () {
        
        const id = $(this).data('id');
        const $modal = $('#assignClientModal');
        const $form  = $modal.find('.ajaxAssignClient');

        $.ajax({
            url: '/api/boss/get/staff',
            method: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            success: function (response) {

                if (!response.success) {
                            alert('Not found');
                            $modal.modal('hide');
                            return;
                }

                $form.attr('action', '/api/boss/assign/client');

                let teamList = '';

                   teamList +=  '<label class="form-label">Select Staff</label>'+
                                '<select class="form-control select2" name="staffId" data-control="select2" data-toggle="select2" required>'+
                                '<optgroup label="Natkern Marketing Team">'+
                                '<option value="" selected disabled>Select</option>';
                            
                            for (let i = 0; i < response.marketers.length; i++) {
                                    
                                    teamList += '<option value="' + response.marketers[i].id + '">' + response.marketers[i].firstname + ' ' + response.marketers[i].surname + '</option>';
                             }

                    teamList += '</optgroup>'+
                                '</select>';
                    
                $('.marketingTeamHere').html(teamList);
                $modal.modal('show');
            },

            error: function () {
                alert('Failed to fetch details.');
                $modal.modal('hide');
            }
        });
    });
    // end of getting staff

    /*  delegated AJAX POST handler for assigning client to staff */
    $(document).on('submit', '.ajaxAssignClient', function (e) {
        e.preventDefault();

        const actionUrl  = $(this).attr('action');
        const formData   = $(this).serialize();
        const $submitBtn = $(this).find('[type="submit"]');
        const originalBtnHtml = $submitBtn.html();

        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },

            beforeSend: function () {
                $submitBtn.prop('disabled', true)
                          .html('<span class="spinner-border spinner-border-sm me-1"></span> Please wait...');
            },

            success: function (response) {

                $('#assignClientModal').modal('hide');
                
                if (response.success) {

                     let clientsRow = '';

                     for (let i = 0; i < response.clients.length; i++) {

                        clientsRow += '<tr>'+
                                            '<td>'+ response.clients[i].firstname +' '+ response.clients[i].surname +'</td>'+
                                            '<td>'+ response.clients[i].email +'</td>'+
                                            '<td>'+ response.clients[i].phone +'</td>'+
                                            '<td>'+ response.clients[i].company +'</td>'+
                                            '<td>'+ response.clients[i].position +'</td>'+
                                            '<td>'+
                                                    '<div class="d-flex flex-wrap gap-2">'+
                                                         '<button type="button" data-id="'+ response.clients[i].id +'" class="btn btn-sm btn-info ajaxClientPipelines" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="info-tooltip" data-bs-title="Pipelines Status"><i class="bi bi-info-lg"></i> </button>'+
                                                    '</div>'+
                                            '</td>'+
                                        '</tr>';
                     }
                     
                     $(".clientsHere").html(clientsRow);

                    // Show success modal
                    $("#successAlertModal .mt-2").text(response.message || "Operation successful.");
                    $("#successAlertModal").modal("show");

                } else {
                    // Show errors
                    const errors = Array.isArray(response.errors) ? response.errors : [response.error || "Something went wrong"];
                    $("#displayErrorsHere").html(errors.join("<br>"));
                    $("#warningAlertModal").modal("show");
                }
            },

            error: function (xhr) {

                $('#assignClientModal').modal('hide');

                let errors = [];

                try {
                        const res = JSON.parse(xhr.responseText);
                        errors = Array.isArray(res.errors) ? res.errors : [res.error || "Unexpected error occurred"];
                    } catch (e) {
                        errors = ["Unexpected error occurred"];
                }

                $("#displayErrorsHere").html(errors.join("<br>"));
                $("#warningAlertModal").modal("show");
            },

             complete: function () {
                // Re-enable submit button & restore original label
                $submitBtn.prop('disabled', false).html(originalBtnHtml);
            }
        });
    });
    /* END of delegated AJAX POST handler for assigning client to staff */

 });