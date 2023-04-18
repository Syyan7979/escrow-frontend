# Escrow - Example for illustrative purposes only.

import smartpy as sp

class Escrow(sp.Contract):
    def __init__(self, owner, fromOwner, counterparty, fromCounterparty, epoch, hashedSecret, admin):
        self.init(fromOwner           = fromOwner,
                  fromCounterparty    = fromCounterparty,
                  balanceOwner        = sp.tez(0),
                  balanceCounterparty = sp.tez(0),
                  hashedSecret        = hashedSecret,
                  epoch               = epoch,
                  owner               = owner,
                  counterparty        = counterparty,
                  admin               = admin,
                  withdrawOwner       = False,
                  withdrawCounterparty = False,
                  completed           = False,
                  cancelled           = False)

    @sp.entry_point
    def addBalanceOwner(self):
        sp.verify(self.data.balanceOwner == sp.tez(0))
        sp.verify(sp.amount == self.data.fromOwner)
        self.data.balanceOwner = self.data.fromOwner

    @sp.entry_point
    def addBalanceCounterparty(self):
        sp.verify(self.data.balanceCounterparty == sp.tez(0))
        sp.verify(sp.amount == self.data.fromCounterparty)
        self.data.balanceCounterparty = self.data.fromCounterparty

    def claim(self, identity):
        sp.verify(sp.sender == identity)
        sp.send(identity, self.data.balanceOwner + self.data.balanceCounterparty)
        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)
        self.data.completed = True

    @sp.entry_point
    def claimCounterparty(self, params):
        sp.verify(sp.now < self.data.epoch)
        sp.verify(self.data.withdrawCounterparty == False)
        sp.verify(self.data.hashedSecret == sp.blake2b(params.secret))
        self.claim(self.data.counterparty)

    @sp.entry_point
    def claimOwner(self):
        sp.verify(self.data.epoch < sp.now)
        sp.verify(self.data.withdrawOwner == False)
        self.claim(self.data.owner)

    @sp.entry_point
    def revertFunds(self):
        sp.verify(sp.sender == self.data.admin)
        sp.verify(self.data.withdrawOwner == True)
        sp.verify(self.data.withdrawCounterparty == True)
        sp.send(self.data.owner, self.data.balanceOwner)
        sp.send(self.data.counterparty, self.data.balanceCounterparty)
        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)
        self.data.cancelled = True
    
    @sp.entry_point
    def withdrawOwner(self):
        sp.verify(sp.sender == self.data.owner)
        sp.verify(self.data.withdrawOwner == False)
        self.data.withdrawOwner = True
    
    @sp.entry_point
    def withdrawCounterparty(self):
        sp.verify(sp.sender == self.data.counterparty)
        sp.verify(self.data.withdrawCounterparty == False)
        self.data.withdrawCounterparty = True

@sp.add_test(name = "Escrow")
def test():
    scenario = sp.test_scenario()
    scenario.h1("Escrow")
    hashSecret = sp.blake2b(sp.bytes("0x01223344"))
    alice = sp.test_account("Alice")
    alice.address = sp.address('tz1hR44gwZNVWGJFUQiRJdedvCmAdPUHgkBC')
    bob = sp.test_account("Bob")
    bob.address = sp.address('tz1SWWafK382BqUpgsv26qDJUmswxWYX5XqM')
    admin = sp.test_account("Admin")
    admin.address = sp.address('tz1MLvzp18yuBX6umbSPAEgeJnqAzm65w9Zq')
    # claimable by counterparty
    c1 = Escrow(bob.address, sp.tez(5), alice.address, sp.tez(15), sp.timestamp(1681912800), hashSecret, admin.address)
    # claimable by owner
    # c1 = Escrow(alice.address, sp.tez(15), bob.address, sp.tez(15), sp.timestamp(1681653600), hashSecret, admin.address)
    # claimable by counterparty
    #c1 = Escrow(alice.address, sp.tez(25), bob.address, sp.tez(5), sp.timestamp(1681819200), hashSecret, admin.address)
    # claimable by owner
    #c1 = Escrow(bob.address, sp.tez(35), alice.address, sp.tez(50), sp.timestamp(1681696800), hashSecret, admin.address)
    scenario += c1