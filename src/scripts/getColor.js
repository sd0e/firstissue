export default function getColor(status) {
    return status === 'available' ? '#15b015' : status === 'assigned' ? '#d14fb8' : '#a61212';
}