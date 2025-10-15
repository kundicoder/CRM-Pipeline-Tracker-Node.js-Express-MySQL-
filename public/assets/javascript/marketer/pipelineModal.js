$(function () { 

    // Handle check clients modal
    $(document).on('click', '.ajaxCheckClients', function () {
        
        const id = $(this).data('id');
        const $modal = $('#addPipelineModal');
        const $form  = $modal.find('.ajaxAddPipeline');

        $.ajax({
            url: '/api/marketer/check/client',
            method: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            dataType: 'json',

            success: function (response) {

            if (response.success) {
                
                $form.attr('action', '/api/marketer/add/pipeline');

                let clientList = '';
                let serviceList = '';

                    clientList += '<label class="form-label">Select Client</label>'+
                                  '<select class="form-control select2" name="clientId" data-control="select2" data-toggle="select2" required>'+
                                        '<option selected disabled>Select</option>'+
                                        '<optgroup label="My Clients">';

                                        for (let i = 0; i < response.clients.length; i++) {

                                                clientList += '<option value="'+response.clients[i].id+'">'+response.clients[i].firstname+' '+response.clients[i].surname+'</option>';
                                            
                                        }
                                            
                    clientList +=  '</optgroup>'+
                                   '</select>';

                    serviceList += '<label for="example-multiselect" class="form-label">Select Services</label>'+
                                   '<select id="example-multiselect" name="serviceIDs" multiple class="form-control" required>';
                                        
                                   for (let i = 0; i < response.services.length; i++) {

                                            serviceList += '<option value="' + response.services[i].id + '">' + response.services[i].name + '</option>';
                                            
                                        }
                                        
                    serviceList += '</select>';

                    $('.clientsHere').html(clientList);
                    $('.servicesHere').html(serviceList);
                    
                    $modal.modal('show');

                }else{
                        // Show errors
                        const errors = Array.isArray(response.errors) ? response.errors : [response.error || "Something went wrong"];
                        $("#displayErrorsHere").html(errors.join("<br>"));
                        $("#warningAlertModal").modal("show");
                }
            },

            error: function () {
                alert('Failed to fetch details.');
                $modal.modal('hide');
            }
        });
    });
    // end of edit client


    /*  delegated AJAX POST handler for adding pipeline */
    $(document).on('submit', '.ajaxAddPipeline', function (e) {
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
            dataType: 'json',

            beforeSend: function () {
                $submitBtn.prop('disabled', true)
                          .html('<span class="spinner-border spinner-border-sm me-1"></span> Please wait...');
            },

            success: function (response) {

                $('#addPipelineModal').modal('hide');
                
                if (response.success) {
                    
                    console.log({'Pipelines are': response.pipelines});

                    let pipelineTable = '';

                    for (let i = 0; i < response.pipelines.length; i++) {
                            
                        const p = response.pipelines[i];

                        pipelineTable += '<tr>';

                        if (p.assigned_to > 0) {
                                
                            pipelineTable += '<td><span class="badge badge-outline-secondary">' + p.firstname + ' &nbsp; ' + p.surname + '</span></td>';
                        
                        } else {
                            
                            pipelineTable += '<td>' + p.firstname + ' &nbsp; ' + p.surname + '</td>';
                        }

                            pipelineTable += '<td>' + p.phone + '</td>' +
                                             '<td>' + p.company + '</td>' +
                                             '<td>' + p.position + '</td>';

                        if (p.status === 'closed') {
                                
                            pipelineTable += '<td><span class="badge bg-purple">Closed</span></td>';
                            
                        } else {
                            
                            pipelineTable += '<td><span class="badge bg-warning">Negotiation</span></td>';
                        
                        }

                        pipelineTable += '<td>' +
                                            '<div class="d-flex flex-wrap gap-2">' +
                                                '<button type="button" data-id="' + p.id + '" class="btn btn-sm btn-info ajaxPipelineProgress" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="info-tooltip" data-bs-title="Pipeline Progress">' +
                                                    '<i class="bi bi-info-lg"></i>' +
                                                '</button>' +
                                            '</div>' +
                                         '</td>' +
                                '</tr>';
                            }
                    console.log({'Row is': pipelineTable});
                    $(".pipelinesHere").html(pipelineTable);
                     
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

                $('#addPipelineModal').modal('hide');

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
    /* END of delegated AJAX POST handler for adding pipeline */

});