showPatientInfo = (thi)=> {
    $('.appointmentDis').removeAttr('disabled')
    $('.appointmentDis').removeAttr('readonly')
        $('#patientName').val('');
    $('#patientIdentity').val('');
    // $('[value="male"]').attr({'checked':'checked'});
    $('#patientPhoneNumber').val('');
    $('#medicalServiceHospital').val('');
   
    $('.dialog').fadeIn();
   
    if (thi) {
        $('.radio [name="patient"]:checked').attr('id')
          $('.appointmentDis').attr('disabled','true');
        $('.dialog_appoin').show()
        console.log( $('.radio [name="patient"]:checked').attr('id'))
        $('#patientName').val($(thi).parent().parent().children().eq(0).text());
        $('#patientIdentity').val($(thi).parent().parent().children().eq(1).text());
        // $('[value="female"]').attr({'checked':'checked'});
        $('#patientPhoneNumber').val($(thi).parent().parent().children().eq(2).text());
        $('#medicalServiceHospital').val($('#medicalHospital option').eq(0).text())

    }
}

cancelEdit = (thi) => {
    console.log(555)

    $('#patientName').val('');
    $('#patientIdentity').val('');
    // $('[value="male"]').attr({'checked':'checked'});
    $('#patientPhoneNumber').val('');
    $('#medicalServiceHospital').val('');
   
            $('.dialog').fadeOut();
    
}
