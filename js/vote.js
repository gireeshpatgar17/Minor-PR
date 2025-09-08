// vote.js
// Voting dashboard integration with blockchain

let web3;
let votingContract;

// Replace these with your deployed contract info
const contractAddress = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      }
    ],
    "name": "VoteCasted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getCandidate",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "party",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
          }
        ],
        "internalType": "struct Voting.Candidate",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "candidatesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const contractABI = 0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005;

async function init() {
    if (typeof window.ethereum === "undefined") {
        showToast("MetaMask not found! Install it to continue.", "error");
        return;
    }

    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();

    votingContract = new web3.eth.Contract(contractABI, contractAddress);

    loadCandidates();
}

// Load candidates from blockchain
async function loadCandidates() {
    const count = await votingContract.methods.candidatesCount().call();
    const container = document.getElementById("candidateList");
    container.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        const candidate = await votingContract.methods.getCandidate(i).call();
        const card = document.createElement("div");
        card.className = "candidate-card";
        card.innerHTML = `
            <h3>${candidate.name}</h3>
            <p>${candidate.party}</p>
            <button onclick="castVote(${candidate.id})">Vote</button>
        `;
        container.appendChild(card);
    }
}

// Cast vote using blockchain
async function castVote(id) {
    const accounts = await web3.eth.getAccounts();
    const voter = accounts[0];

    try {
        await votingContract.methods.vote(id).send({ from: voter });
        showToast("Vote cast successfully ✅", "success");
        setTimeout(() => {
            window.location.href = "result.html";
        }, 2000);
    } catch (err) {
        console.error(err);
        showToast("Error: You may have already voted!", "error");
    }
}

// Toast function
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize dashboard
window.onload = init;

