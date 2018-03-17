[![Build Status](https://travis-ci.org/SolidifyDAO/Solidify.svg?branch=master)](https://travis-ci.org/SolidifyDAO/Solidify)

TODO
- Define how voting works for a given role
- Incorporate role assignment to 

SCHEMES
- Flat amount, individual: Adding new person costs everyone else
- Flat amount, group: Adding new person costs everyone else in group
- Percentage based,

Modularize
- Token Distribution scheme
- Voting
- Roles
- Proposals
- Members

Role???

role needs to be picked beforehand

------ token dist

SCHEMES
- Flat amount, individual: Adding new person costs everyone else
- Flat amount, group: Adding new person costs everyone else in group
- Percentage based,

Member has a role, when a vote is happening, 
role is checked and role refer to token dist scheme for logic on how to calc


ROLE
- getVotes()
    make fn call to token dist scheme:
      flat, ind: role has a number represeting how much an individual gets, return this number
      flat, group: role has a number, return number / group.size
      percentage based: role has a decimal, return global_dao_tokens * decimal.





function addMember(address targetMember, Role role, string memberName) onlyOwner public {
  give the member tokens
  store the member somewhere
}

Role has voting power, so when voting check their role



- each person associated with a single role
