function skillsMember(){
    return{
        restrict: 'E',
        templateUrl: 'views/member.html',
        controller: 'SkillsMemberCtrl',
        controllerAs: 'skillsMemberCtrl',
        bindToController: true,
        scope: {
            member: '='
        }
    };
}